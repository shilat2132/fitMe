const catchAsync = require("../../../utils/catchAsync")
// const factory = require("../../factory")
const Appt = require("../../../models/time/Appointment")
const utils = require("../../utils")
const AppError = require("../../../utils/AppError")

/**
 * - this is a restricted route for user with role= trainee
 * - present the user's appointments
 */
exports.getMyAppts = catchAsync(async (req, res, next)=>{
    const docs = await Appt.find({trainee: req.user._id}).select("-trainee")

    if (!docs){
        return next(new AppError('לא נמצאו מסמכים '), 404)
    }
    res.status(200).json({status: "success", docs})
})

// need to add sending email

/**
 * an handler for a user to schedule an appointment (workout)
 */
exports.makeAnAppt = catchAsync(async (req, res, next)=>{
    const {dayId, date ,trainerId, hour} = req.body
    if (!dayId || !date || !trainerId || hour){
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
 * cancels an appointment by deleting it
 * expects to get apptId in the request's body
 *  */
exports.cancelAppt = catchAsync(async (req, res, next)=>{
    const apptId = req.params.apptId

    if (!await Appt.findByIdAndDelete(apptId)){
        return next(new AppError("failed to delete an appointment"), 500)
    }
    res.status(204).json({status: "success"})
})