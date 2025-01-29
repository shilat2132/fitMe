const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/AppError")
// const utils = require("../utils")
const Trainer = require("../../models/users/Trainer")
const User = require("../../models/users/User")


// turn a user into a trainer

/**
 * an handler for the manager to turn a user into a trainer - beacuse every user is defaulted to a 'trainee' when signing up
 */
exports.userToTrainer = catchAsync(async (req, res, next)=>{
    const user = await User.findOne({_id: req.params.userId, role: "trainee"})

      if (!user){
        return next (new AppError("User not found", 404))
      }

      const workingHours = {
        start: "8:00",
        end: "16:00"
      }

    let trainer = new Trainer({
        ...user.toObject(),
        role: "trainer",
        _id: new mongoose.Types.ObjectId(), 
        workingHours
    });

    await trainer.save();
    await User.deleteOne({ _id: user._id });

    res.status(200).json({status: "success", trainer})
})