const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/AppError")
const utils = require("../utils")
const Trainer = require("../../models/users/Trainer")




// cancel someone's appointment


// add vacation
exports.addVacation = catchAsync(async (req, res, next)=>{
    const newVacation = utils.filterBody("schedule", "from", "to", "description")
    
    // adds the vacation to the array of the vacations
    await Trainer.findByIdAndUpdate(
        req.user._id, 
        { $push: { vacations: newVacation } }, 
        { new: true, runValidators: true }
      );
})

// cancel vacation

// add workout type