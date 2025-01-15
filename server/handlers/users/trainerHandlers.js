const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/AppError")
const utils = require("../utils")
const Trainer = require("../../models/users/Trainer")


// add vacation
/**
 * an handler for a trainer to add a vacation's request
 */
exports.addVacation = catchAsync(async (req, res, next)=>{
    const newVacation = utils.filterBody(req.body, "schedule", "from", "to", "description")
    
    // adds the vacation to the array of the vacations
    const trainer = await Trainer.findByIdAndUpdate(
        req.user._id, 
        { $push: { vacations: newVacation } }, 
        { new: true, runValidators: true }
      );
    
      if (!trainer){
        return next (new AppError("Trainer not found", 404))
      }

      res.status(200).json({status: "success", trainer})
})

// cancel vacation
/**
 * this is the handler for the trainer to cancel one vacation by its id from the route params
 */
exports.cancelVacation = catchAsync(async (req, res, next)=>{
  const vacId = req.params.vacId
  const trainerId = req.user._id

  // find by trainer id. remove the vacation item from the vacations array
  const trainer = await Trainer.findByIdAndUpdate(trainerId,
    {$pull: {vacations: {_id: vacId}}},
    { new: true}
  )

  if (!trainer){
    return next (new AppError("Trainer not found or vacation not found", 404))
  }

  res.status(200).json({status: "success", trainer})
})


// add workout type handler