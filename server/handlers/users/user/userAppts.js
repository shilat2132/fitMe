const catchAsync = require("../../../utils/catchAsync")
// const factory = require("../../factory")
const Appt = require("../../../models/time/Appointment")
const utils = require("../../utils")
const AppError = require("../../../utils/AppError")

/**
 * - this is a restricted route for user with role= trainee
 * - presents the user's appointments
 */
exports.getMyAppts = catchAsync(async (req, res, next)=>{
    const docs = await Appt.find({trainee: req.user._id}).select("-trainee")

    if (!docs){
        return next(new AppError("Couldn't find files"), 404)
    }
    res.status(200).json({status: "success", docs})
})

// need to add sending email

/**
 * an handler for a user to schedule an appointment (workout)
 */
exports.makeAnAppt = catchAsync(async (req, res, next)=>{
    const {dayId, date ,trainerId, hour, workout} = req.body
    if (!dayId || !date || !trainerId || !hour || !workout){
        return next(new AppError("one of the details are missing"), 400)
    }
    if (utils.isApptAvailable(dayId, date, hour, trainerId)){
        if (!await Appt.create(req.body)){
            return next(new AppError("failed to make an appointment"), 500)
    }
    res.status(200).json({status: "success"})
        
    }else{
        return next(new AppError("appointment isn't available"), 409)
    }
})


// need to add sending email

/** 
    * - cancels an appointment by deleting it. 
    * - either by the user himself or the trainer. trainers can't cancel an appointment that isn't for them and so are the users
    * - expects to get apptId in the request's params
 */
exports.cancelAppt = (caller="trainee") => (
    catchAsync(async (req, res, next)=>{
        let appt
        if (caller == "trainee"){
            appt = await Appt.findOne({_id: req.params.apptId, trainee: req.user._id})
        }else if (caller=="trainer"){
            appt = await Appt.findOne({_id: req.params.apptId, trainer: req.user._id})
        }
        
        if (!appt){
            return next(new AppError("appointment wasn't found"), 404)
        }
        await appt.delete()
        res.status(204).json({status: "success"})
    })
)