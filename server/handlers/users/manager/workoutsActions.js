const catchAsync = require("../../../utils/catchAsync")
const AppError = require("../../../utils/AppError")
const Schedule = require("../../../models/time/Schedule")
// const utils = require("../utils")


/**
 * an handler for the manager to add workout types
 */
exports.addWorkoutType = catchAsync(async (req, res, next)=>{
     const scheduleId = req.params.scheduleId
     const {workouts} = req.body

     if (!scheduleId || !workouts || !Array.isArray(workouts) || workouts.length == 0){
        return next (new AppError("you have to provide schedule id and a non-empty workouts Array", 400))
     }
    const schedule = await Schedule.findByIdAndUpdate(
        scheduleId, 
        { $push: { workouts: {$each: workouts} } }, 
        { new: true, runValidators: true }
      );

      if (!schedule){
        return next (new AppError("Couldn't add workout types", 500))
      }


    res.status(200).json({status: "success", schedule})
})


/**
 * an handler for the manager to delete workout types
 */
exports.deleteWorkoutsType = catchAsync(async (req, res, next)=>{ 
  const scheduleId = req.params.scheduleId
  const {workouts} = req.body

  if (!scheduleId || !workouts || !Array.isArray(workouts) || workouts.length == 0){
     return next (new AppError("you have to provide schedule id and a non-empty workouts Array", 400))
  }
 const schedule = await Schedule.findByIdAndUpdate(
     scheduleId, 
     { $pull: { workouts: {$in: workouts} } }, 
     { new: true, runValidators: true }
   );

   if (!schedule){
     return next (new AppError("Couldn't delete workout types", 500))
   }

   const filterQuery = {
    workouts: {$in: workouts}
   }

   const updateTrainersObj = {$pull: {workouts: {$in: workouts}}}
   
   const trainers = await Trainer.updateMany(filterQuery, updateTrainersObj)
   if (!trainers){
    return next (new AppError("Couldn't remove workout types from the trainers", 500))
  }

 res.status(204).json({status: "success"})
})

