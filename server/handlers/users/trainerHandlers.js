const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/AppError")
const utils = require("../utils")
const Trainer = require("../../models/users/Trainer")
const Vacation = require("../../models/users/Vacation")


// add vacation
/** restricted route for a trainer.
 * an handler for a trainer to add a vacation's request
 */
exports.addVacation = catchAsync(async (req, res, next)=>{
    const newVacation = utils.filterBody(req.body, "schedule", "from", "to", "description")
    const vacation = Vacation.create({trainer: req.user._id, ...newVacation})

    // // adds the vacation to the array of the vacations
    // const trainer = await Trainer.findByIdAndUpdate(
    //     req.user._id, 
    //     { $push: { vacations: newVacation } }, 
    //     { new: true, runValidators: true }
    //   );
    
      if (!vacation){
        return next (new AppError("Failed to create a vacation", 404))
      }

      res.status(200).json({status: "success", vacation})
})

// cancel vacation
/**
 * this is the handler for the trainer to cancel one vacation by its id from the route params
 */
exports.cancelVacation = catchAsync(async (req, res, next)=>{
  const vacId = req.params.vacId

  
  
  // find by trainer id. remove the vacation item from the vacations array
  // const trainer = await Trainer.findByIdAndUpdate(trainerId,
  //   {$pull: {vacations: {_id: vacId}}},
  //   { new: true}
  // )

  if (!await Vacation.findOneAndDelete({_id: vacId, trainer: req.user._id})){
    return next (new AppError("Couldn't cancel vacation", 404))
  }

  res.status(204).json({status: "success"})
})


// add workout type handler


exports.updateMe = catchAsync(async (req, res, next)=>{
  const vacId = req.params.vacId

  

  if (!await Vacation.findOneAndDelete({_id: vacId, trainer: req.user._id})){
    return next (new AppError("Couldn't cancel vacation", 404))
  }

  res.status(204).json({status: "success"})
})