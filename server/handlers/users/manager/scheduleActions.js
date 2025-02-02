const catchAsync = require("../../../utils/catchAsync")
const AppError = require("../../../utils/AppError")
const utils = require("../../utils")
const Schedule = require("../../../models/time/Schedule")

/**
 * an handler for the manager to create the schedule
 */
exports.createSchedule = catchAsync(async (req, res, next)=>{
   const filterObj = utils.filterBody(req.body, "maxDaysForward", "appointmentTime", "workouts")

    
   const schedule = await Schedule.Create(filterObj);

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
    const schedule = await Schedule.findOneAndUpdate( query , filterObj);
 
      if (!schedule){
        return next (new AppError("Couldn't update schedule", 500))
      }

      if ("maxDaysForward" in filterObj){
        if (await schedule.updateDays== -1){
            return next (new AppError("Couldn't update schedule", 500))
        }
      }

      await schedule.save()
 
 
    res.status(200).json({status: "success", schedule})
 })


 /**
 * an handler for the manager to delete the schedule
 */
exports.deleteSchedule = catchAsync(async (req, res, next)=>{
    if (!await Schedule.findByIdAndDelete()){
        return next (new AppError("Couldn't delete schedule", 500))
    }
 
    res.status(204).json({status: "success"})
 })
