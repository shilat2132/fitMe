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
      return next (new AppError("Couldn't get schedule", 500))
    }

    await schedule.updateDays()
    await schedule.save()

  res.status(200).json({status: "success", schedule})
})


exports.getTrainersForDay = catchAsync(async (req, res, next)=>{
  const schedule = await Schedule.findOne()

    if (!schedule){
      return next (new AppError("Couldn't find a schedule", 500))
    }

    const givenDate = new Date(req.params.date)
    const today = new Date()
    const {start} = utils.startEndDay(today)

    const lastDay = new Date()
    lastDay.setDate(lastDay.getDate()+schedule.maxDaysForward)
    const {end} = utils.startEndDay(lastDay)
    
    
    if (!(givenDate>= start && givenDate<=end)) {
        return next(new AppError("The given date isn't in the range of the opened dates of the schedule", 400));
    }

   const trainersArray = await schedule.getWorkingTrainers(req.params.date)
   if (!trainersArray){
    return next (new AppError("Couldn't get trainers", 500))
   }

   let trainers = {}
   trainersArray.forEach(trainer => {
      if (trainer.availableHours.length >0 && trainer.workouts.length >0){
        trainers[trainer._id] = trainer
      }
   });


  res.status(200).json({status: "success", trainers})
})


/**
 * an handler for the manager to create the schedule
 */
exports.createSchedule = catchAsync(async (req, res, next)=>{
   const filterObj = utils.filterBody(req.body, "maxDaysForward", "appointmentTime", "workouts")

   const schedule = await Schedule.create(filterObj);

     if (!schedule){
       return next (new AppError("Couldn't create a schedule", 500))
     }

     


   res.status(200).json({status: "success", schedule})
})

/**
 * an handler for the manager to create the schedule
 */
exports.updateSchedule = catchAsync(async (req, res, next)=>{
    const filterObj = utils.filterBody(req.body, "maxDaysForward", "appointmentTime")

    // update the schedule only if the new value for maxDaysForward is larger or equal to the previous one
    const query = "maxDaysForward" in filterObj ? {maxDaysForward: {$lte: filterObj.maxDaysForward}} : {}
    const schedule = await Schedule.findOneAndUpdate( query , filterObj, {new: true});
 
      if (!schedule){
        return next (new AppError("Couldn't update schedule. Please notice that you can only update the field of maxDaysForward to be larger or equal to the previous one", 500))
      }

      if ("maxDaysForward" in filterObj){
        await schedule.updateDays()
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
