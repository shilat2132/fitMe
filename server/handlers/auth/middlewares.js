const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const User = require("../../users/User")
const catchAsync = require("../../../utils/catchAsync")


/** a middleware to protect routes by checking if the the jwt token in the cookie is still valid */
exports.protect = catchAsync(async (req, res, next)=>{
    // Step 1: extract the token from the headers (for dev) or from the cookie(for production), throw an error if it doesn't exist
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1]
    } 
    else if(req.cookies.jwt){
      token = req.cookies.jwt
  }

    if(!token){
      return next(new AppError('עליך להיכנס', 401))
    }

    //Step 2: verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //Step 3: see if the user stil exists
    const user = await User.findById(decoded.id)
    if(!user){
      return next(new AppError('המשתמש כבר לא קיים', 401))
    }

    //Step 4: Check if user changed password after the token was issued
    if(user.changedPasswordAfter(decoded.iat)){
      return next (new AppError ('משתמש זה שינה את הסיסמה, אנא כנס שוב', 401))
    }

    //Finally, grant acess to protected route
    req.user = user
    next()

})


/** @param roles - an array of the roles that are permitted to reach the route after the mw
 * - allows to continue only if the current user's role is in the roles array
 */
exports.restrictTo = (...roles)=>{
    return (req, res, next)=>{
      if(!roles.includes(req.user.role)){
        return next(new AppError('אינך מוסמך לבצע את הפעולה הזאת', 403))
      }
      next()
    }
  }