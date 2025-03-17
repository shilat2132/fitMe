const catchAsync = require("../../../utils/catchAsync")
const Appt = require("../../../models/time/Appointment")
const AppError = require("../../../utils/AppError")
const Appointment = require("../../../models/time/Appointment")
const Email = require("../../../utils/email")


// need to add sending email

/**
 * an handler for a user to schedule an appointment (workout)
 */
exports.makeAnAppt = catchAsync(async (req, res, next)=>{
    const {date ,trainer, hour, workout} = req.body

    if (!date || !trainer || !hour || !workout){
        return next(new AppError("one of the details are missing"), 400)
    }

    const {result, message} = await Appointment.isApptAvailable(date, hour, trainer, workout)
    if (result){
        const doc = await Appt.create({...req.body, trainee: req.user._id})
        if (!doc){
            return next(new AppError("failed to make an appointment"), 500)
    }

    try {
        await new Email(req.user).sendScheduledAppt(workout, date, hour)
    } catch (error) {
        return next(new AppError("Your appointment was scheduled, but the email wasn't sent successfuly.", 500))
    }
    res.status(200).json({status: "success", doc})
        
    }else{
        return next(new AppError(message ? message : "error"), 409)
    }
})


// need to add sending email

/** 
    * - cancels an appointment by deleting it. 
    * - either by the user himself or the trainer. trainers can't cancel an appointment that isn't for them and so are the users
    * - expects to get apptId in the request's params
 */
exports.cancelAppt = catchAsync(async (req, res, next)=>{
        const caller = req.user.role
        let doc
        try {
            if (caller == "trainee"){
                doc = await Appt.findOneAndDelete({_id: req.params.apptId, trainee: req.user._id}, { returnDocument: "before" })
            }else if (caller=="trainer"){
                doc = await Appt.findOneAndDelete({_id: req.params.apptId, trainer: req.user._id}, { returnDocument: "before" })
            }else if(caller==="manager"){
                doc = await Appt.findByIdAndDelete(req.params.apptId, { returnDocument: "before" })
            }

            if(!doc){
                return next(new AppError("appointment wasn't found"), 404)
            }

            try {
                await new Email(doc.trainee).sendCancelAppt(doc.date, doc.workout, doc.hour, caller==="trainee")
            } catch (error) {
                return next(new AppError("Your appointment was scheduled, but the email wasn't sent successfuly.", 500))
            }

            res.status(204).json({status: "success"})
        } catch (error) {
            return next(new AppError("appointment wasn't found"), 404)
        }
        
        
    })
