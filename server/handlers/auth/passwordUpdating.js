
const crypto = require('crypto')
const Email = require("../../utils/email")
const User = require("../../models/users/User")
const catchAsync = require("../../utils/catchAsync")
const authHandlers = require("./authHandlers")
const AppError = require('../../utils/AppError')


/**creates a token for resetting the password and sends an email with the url for the resetting route */
exports.forgotPassword = catchAsync(async (req, res, next)=>{
    //Step 1: find the user by the email and checks that there is a user with that email 
    const user = await User.findOne({email: req.body.email})
  
      if(!user){
        return next(new AppError("Couldn't find a user with the given email", 404))
      }
  
      // Step 2: create a reset token for a reset and hash it to the db
      const resetToken = user.createPasswordResetToken();
      await user.save({validateBeforeSave: false})
  
      // Step 3: create the url for resetting with the token and send the email
      const resetUrl = `${req.body.domain}/resetPassword/${resetToken}`
  
      const message = `שכחת את הסיסמה? צור סיסמה חדשה בלינק המצורף, אם לא הגשת בקשה לשינוי סיסמה, אנא התעלם מהמייל הזה. ${resetUrl}`
  
      try {
        await new Email(user).sendResetPassword(message, resetUrl)
        res.status(200).json({status: "success", message: "token sent to email"})
      } catch (error) {
          user.passwordResetToken = undefined
          user.passwordResetTokenExpires = undefined
          await user.save({validateBeforeSave: false})
          return next(new AppError("שליחת המייל נכשלה, אנא נסו שוב מאוחר יותר", 500))
      }
  })
  
  
  /** finds the user by the token in the request url and if it's valid - updates the password and creates new jwt token */
  exports.resetPassword = catchAsync(async (req, res, next)=>{
    // hash the token from the request and use it to find the user. if the token was expired, it won't dind any user
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne(
      {passwordResetToken: hashedToken, 
      passwordResetTokenExpires: {$gt: Date.now()}})
      
      if(!user){
        return next(new AppError('Token is invalid or has expired', 400))
      }
      
      // if the token is valid - update the password and remove the token.
      user.password = req.body.password
      user.passwordConfirm = req.body.passwordConfirm
      user.passwordResetToken = undefined
      user.passwordResetTokenExpires = undefined
      // pre-save middleware would hash the password in the db
      await user.save()
  
      // create new jwt token for the cookie
      authHandlers.createSendToken(user, req, 200, res)
  })
  
  
  /** protected route for the user to update his password
   * - compares the current password the user entered with the one in the db
   * - updates the password
   * - creates new jwt token and stores in a cookie
   */
  exports.updatePassword = catchAsync(async (req, res, next)=>{
  
    const user = await User.findById(req.user._id).select('+password')
    if(!await user.correctPassword(req.body.currentPassword, user.password)){
      return next (new AppError("Current password is wrong", 401))
    }
  
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    authHandlers.createSendToken(user, req, 200, res)
      
  })