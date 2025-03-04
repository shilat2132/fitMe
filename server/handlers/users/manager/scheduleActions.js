const catchAsync = require("../../../utils/catchAsync")
const AppError = require("../../../utils/AppError")
const utils = require("../../../utils/utils")
const Schedule = require("../../../models/time/Schedule")
const mongoose = require("mongoose")
const Appointment = require("../../../models/time/Appointment")
const Vacation = require("../../../models/users/Vacation")
const Trainer = require("../../../models/users/Trainer")


/**
 * an handler to get the schedule
 */
exports.getSchedule = catchAsync(async (req, res, next)=>{
  const schedule = await Schedule.findOne()

    if (!schedule){
      return next (new AppError("Couldn't create schedule", 500))
    }

    await schedule.updateDays()
    await schedule.save()

  res.status(200).json({status: "success", schedule})
})



/**
 * an handler for the manager to create the schedule
 */
exports.createSchedule = catchAsync(async (req, res, next)=>{
   const filterObj = utils.filterBody(req.body, "maxDaysForward", "appointmentTime", "workouts")

   const schedule = await Schedule.create(filterObj);

     if (!schedule){
       return next (new AppError("Couldn't create schedule", 500))
     }

     


   res.status(200).json({status: "success", schedule})
})

/**
 * an handler for the manager to create the schedule
 */
exports.updateSchedule = catchAsync(async (req, res, next)=>{
    const filterObj = utils.filterBody(req.body, "maxDaysForward", "appointmentTime")
    const query = "maxDaysForward" in filterObj ? {maxDaysForward: {$lte: filterObj.maxDaysForward}} : {}
    const schedule = await Schedule.findOneAndUpdate( query , filterObj, {new: true});
 
      if (!schedule){
        return next (new AppError("Couldn't update schedule", 500))
      }

      if ("maxDaysForward" in filterObj){
        if (await schedule.updateDays()== -1){
            return next (new AppError("Couldn't update schedule", 500))
        }
      }

      await schedule.save()
 
 
    res.status(200).json({status: "success", schedule})
 })


 /**
 * an handler for the manager to delete the schedule, and by doing that deleting the appointments, 
 * vacations and all the workouts types from the trainers
 */
exports.deleteSchedule = catchAsync(async (req, res, next)=>{
    const session = await mongoose.startSession() 
    session.startTransaction() 
   
    try {
      await Schedule.findOneAndDelete().session(session)
      await Appointment.deleteMany().session(session)
      await Vacation.deleteMany().session(session)
      await Trainer.updateMany({}, {workouts: []}).session(session)
      
      await session.commitTransaction()
      session.endSession()
      res.status(204).json({status: "success"})

    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.log(error)
      return next (new AppError("Couldn't delete schedule", 500))
    }
 })
