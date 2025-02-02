const catchAsync = require("../../../utils/catchAsync")
const factory = require("../../factory")
const User = require("../../../models/users/User")
const Trainer = require("../../../models/users/Trainer")
const utils = require("../../../utils/utils")
const Appt = require("../../../models/time/Appointment")

/**
 * - an handler for a user to update his name, phone or email
 * - this is an handler triggered only by a protected route
 * - throws an error if user is trying to change password or passwordConfirm fields through that route
 */
exports.updateMe = catchAsync(async (req, res, next)=>{
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("this route is not for update a password", 400))
    }

    const filteredObj = utils.filterBody(req.body, "name", "email", "phone")
    let updatedUser;
    
    if(req.user.role == "trainer"){
        if (req.body.workingHours){
            filteredObj["workingHours"] = {
                start: req.body.workingHours.start ? req.body.workingHours.start : "8:00",
                end: req.body.workingHours.end ? req.body.workingHours.end : "16:00"
            }
        }
        if(req.body.restingDay){
            filteredObj["restingDay"] = req.body.restingDay
        }
        updatedUser = await Trainer.findByIdAndUpdate(req.user._id, filteredObj, {new: true, runValidators: true})
    }else{
        updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {new: true, runValidators: true})
    }
    

    res.status(200).json({status: 'success', updatedUser})
})

/** an handler to get the user */
exports.getUser = catchAsync(async (req, res, next)=>{
    res.status(200).json({status: "success", user: req.user})
})


/**
 * an handler to delete a user
 * - overriting the jwt token
 * - deletes all the user's appointments
 * - delete the user's collection doc
 */
exports.deleteUser = catchAsync(async (req, res, next)=>{
    try {
        res.cookie('jwt', 'logout', { expires: new Date(Date.now() + 10 *1000), httpOnly: true })
        await Appt.deleteMany({trainee: req.user._id})
        await User.findByIdAndDelete(req.user._id)
        return res.status(204).json({status: 'success'})
    } catch (error) {
        return next(new AppError("couldn't delete user", 500))
    }
})



