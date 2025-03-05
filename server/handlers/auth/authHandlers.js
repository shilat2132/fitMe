const jwt = require('jsonwebtoken')

const User = require("../../models/users/User")
const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/AppError")

//HELPFUL FUNCTIONS
/**sign a new jwt token with a user'd id */
const signToken = id=> jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRESIN} )

/**
 * - creates the jwt token with the user's id as payload
 * - stores it in an http cookie named 'jwt', the token and the expiration date
 * - removes the password so that it won't be sent in the response
 * - sends a server's response with the user's object, the token and its expiration
 */
const createSendToken = (user, req, statusCode, res)=>{
    const token = signToken(user._id)
    const tokenExpiration =new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    )

    
    res.cookie('jwt', token, {
      expires: tokenExpiration,
      httpOnly: true,
      // only in production
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
   
    // Remove password from output
    user.password = undefined
    res.status(statusCode).json({
        status: 'success',
        data: {token, tokenExpiration:process.env.JWT_COOKIE_EXPIRES_IN, user}
    })

}

exports.createSendToken = createSendToken

//HANDLERS
/**
 * - the user signs up with his details and a new user is created in the database
 * - a jwt token is created and is saved in a cookie
 * - a server's response is sent with the user's object, the token and its expiration
 */
exports.signup = catchAsync (async (req, res, next)=>{
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm, 
    })

   createSendToken(user, req, 200, res)

})


/**
 * - validates email and password
 * - creates a jwt token and store it in a cookie
 *  - sends back a response with the user's object, token and its expiration
 */
exports.login = catchAsync(async (req, res, next)=>{
  // Step 1: retrieve the email and password that the user entered
 
  const {email, password} = req.body
  if(!email || !password){
    
    return next(new AppError("You must provide both email and password in order to login", 400))
  }
  
  // Step 2: check if there's a user with that email and check if the user entered the correct password
  const user = await User.findOne({email}).select('+password')

  if(!user || !await user.correctPassword(password, user.password)) {
    return next(new AppError('Invalid password or email', 401))
  }

  // Step 3: create a token to store in a cookie and send a server's response
  createSendToken(user, req, 200, res)
})


/**overrite the cookie to log the user out. send a server's response with status of 'success' */
exports.logout = (req, res)=>{
    res.cookie('jwt', 'logout', { //overrite the cookie with the token
      expires: new Date(Date.now() + 10 *1000), httpOnly: true })
      res.status(200).json({status: 'success'})
  }



