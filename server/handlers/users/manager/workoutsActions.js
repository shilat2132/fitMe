const catchAsync = require("../../../utils/catchAsync")
const AppError = require("../../../utils/AppError")
const Schedule = require("../../../models/time/Schedule")
// const utils = require("../utils")


// add a workout
/**
 * an handler for the manager to add a workout type
 */
exports.addWorkoutType = catchAsync(async (req, res, next)=>{
     // adds the workout to the array of the workouts
     const {scheduleId, workouts} = req.body

     if (!scheduleId || !workouts || !Array.isArray(workouts)){
        return next (new AppError("you have to provide schedule id and a workouts Array", 400))
     }
    const schedule = await Schedule.findByIdAndUpdate(
        scheduleId, 
        { $push: { workouts: {$each: workouts} } }, 
        { new: true, runValidators: true }
      );

      if (!schedule){
        return next (new AppError("Couldn't add a workout type", 404))
      }


    res.status(200).json({status: "success", schedule})
})

// get all workouts

// delete a workout