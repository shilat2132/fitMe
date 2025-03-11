// security MW packages
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors')

// general packages
const dotenv = require('dotenv')
const path = require('path');
const express = require('express')


// packages that deal with requests
const cookieParser = require('cookie-parser');
const compression = require("compression")

// errors utils imports
const errHandler = require("./utils/errHandler");
const AppError = require('./utils/AppError');

// routers imports
const scheduleRouter = require("./routes/scheduleRoutes")
const managerRouter = require("./routes/managerRoutes")
const trainerRouter = require("./routes/trainerRoutes")
const userRouter = require("./routes/userRoutes")
const workoutTypesRouter = require("./routes/workoutsTypes")
const appointmentsRouter = require("./routes/appointmentsRoutes")

// END OF IMPORTS


const app = express()
dotenv.config({ path: './config.env' });

// app.use(express.static(path.join(__dirname, '../frontend/build'))); //serves static files from the client's side for production

// after deployment, the client's requests go through the deployment services' proxy, 
  // so in order to get the client's ip and not the proxy's (for uses like limiting requests), we need to write that line
app.set('trust proxy', 1);


//SECURITY HANDLING 

// This middleware manages which origins are permitted to access the resources - used when having different domains for the server and client
app.use(cors({ credentials: true, // Allow cookies and credentials in requests
  origin: ['https://cosmetic-api.onrender.com', 'https://cosmetic.onrender.com', 'http://localhost:5173']
}))
app.options('*', cors())


// Security mw to set HTTP headers for enhanced security to prevent XSS, Clickjacking, Data Leakage...
app.use(helmet())


// prevents DOs attack abuse by limiting number of requests from one user
const limiter = rateLimit({
  max: 100,
  windoMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour"
})

app.use('/', limiter)


// Middleware for parsing JSON and URL-encoded data and cookies
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Data sanitization against NoSQL query injection - removes $ and others from req.body/params
app.use(mongoSanitize());

// Cleans user input to remove malicious scripts and HTML that could lead to Cross-Site Scripting (XSS) attacks.
app.use(xss()); //prevents inserting html syntax(from forms or queries)

// Middleware to compress HTTP responses for improved performance
app.use(compression())

// routes
app.use("/api/user", userRouter)
app.use("/api/schedule", scheduleRouter)
app.use("/api/trainer", trainerRouter)
app.use("/api/manager", managerRouter)
app.use("/api/workoutsTypes", workoutTypesRouter)
app.use("/api/appointments", appointmentsRouter)





app.all('*', (req,res, next)=>{
    next(new AppError (`couldn't reach ${req.originalUrl} on the server`, 404)) 
    //while calling next with an argument, it goes to the global err handling func
  })

// each time i throw appError instance or an error occur from async func, 
// the catchAsync catches it and moves to this mw
app.use(errHandler)
module.exports = app