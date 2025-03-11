const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/AppError")
const utils = require("../../utils/utils")
const Trainer = require("../../models/users/Trainer")
const Vacation = require("../../models/users/Vacation")
const Appointment = require("../../models/time/Appointment")



/** gets all appointment for the trainer, with option of filtering by date */
exports.getAppts = catchAsync(async (req, res, next)=>{


    let filter = {}
    if (req.user.role == "trainer"){
      filter= {trainer: req.user._id}
    }else if(req.user.role == "trainee"){
      filter= {trainee: req.user._id}
    }

    if (req.query.date){
      const {start, end} = utils.startEndDay(req.query.date)
      filter = {...filter,
                  date: {
                    $gte: start,
                    $lte: end
                }}
    }
   
    
      const appts = await Appointment.find(filter).sort({date: 1})

    
      if(!appts){
        return next(new AppError("Couldn't find appointments"), 404)
      }
      res.status(200).json({status: "success", amount: appts.length , appts})
  })

// add vacation
/** restricted route for a trainer.
 * an handler for a trainer to add a vacation's request
 */
exports.addVacation = catchAsync(async (req, res, next)=>{
    const newVacation = utils.filterBody(req.body, "from", "to", "description")
    const vacation = await Vacation.create({trainer: req.user._id, ...newVacation})
    
      if (!vacation){
        return next (new AppError("Failed to create a vacation", 500))
      }

      res.status(200).json({status: "success", vacation})
})

// cancel vacation
/**
 * this is the handler for the trainer to cancel one vacation by its id from the route params
 */
exports.cancelVacation = catchAsync(async (req, res, next)=>{
  const vacId = req.params.vacId

  if (!await Vacation.findOneAndDelete({_id: vacId, trainer: req.user._id})){
    return next (new AppError("Couldn't cancel vacation", 500))
  }

  res.status(204).json({status: "success"})
})


// add workout type handler

/** an handler for the trainer to update only the details related to work */
exports.updateWorkDetails = catchAsync(async (req, res, next)=>{
  const updateValues = utils.filterBody(req.body, "workingHours", "restingDay")
  
  let queryUpdate = updateValues
  if ("workouts" in req.body) {
    queryUpdate.$addToSet = { workouts: { $each: req.body.workouts } };
}
  const trainer = await Trainer.findByIdAndUpdate(req.user._id, queryUpdate, {runValidators: true, new: true})

  if (!trainer){
    return next (new AppError("Couldn't update details", 500))
  }

  res.status(200).json({status: "success", trainer})
})