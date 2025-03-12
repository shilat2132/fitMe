const catchAsync = require("../../../utils/catchAsync")
const AppError = require("../../../utils/AppError")
const Trainer = require("../../../models/users/Trainer")
const User = require("../../../models/users/User")
const mongoose = require("mongoose")
const Appointment = require("../../../models/time/Appointment")

// turn a user into a trainer

/**
 * an handler for the manager to turn a user into a trainer - beacuse every user is defaulted to a 'trainee' when signing up
 */
exports.userToTrainer = catchAsync(async (req, res, next)=>{
  const session = await mongoose.startSession() //opens a temperary connection to the db to group all the queries in the transaction
  session.startTransaction() 

  try {
    const user = await User.findOne({_id: req.params.userId, role: "trainee"}).select("+password").session(session)
      if (!user){
        await session.abortTransaction()
        session.endSession()
        return next (new AppError("User not found", 404))
      }

      const workingHours = {
        start: "8:00",
        end: "16:00"
      }

      await Appointment.deleteMany( {trainee: user._id }).session(session)
      await User.deleteOne({ _id: user._id }).session(session) //deletes the user document before creating the Trainer to avoid duplicate fields error of the email
      
      let trainer = new Trainer({
        ...user.toObject(),
        role: "trainer",
        _id: new mongoose.Types.ObjectId(), 
        workingHours
      });

    await trainer.save({session})
    
    await session.commitTransaction() //activates the queries of the transaction to the database
    session.endSession()

    return res.status(200).json({status: "success", trainer})
  } catch (error) {
      // if an error occured, the queries would be canceled to not lose the user document
      await session.abortTransaction()
      session.endSession()
      return next(error)
  }
})



exports.getTrainee = catchAsync(async (req, res, next)=>{
           
  const user = await User.findOne({_id: req.params.id, role: "trainee"}).select("name email _id phone").populate({path: "appointments"})

  if(!user){
    return next(new AppError("Couldn't find the user"), 404)
    }

            res.status(200).json({status: "success", doc: user})
    })


    exports.getUser = (Model, select, role, pathPopulate)=>(
      catchAsync(async (req, res, next)=>{
        let query = {_id: req.params.id}
           if(role === "trainee"){
            query = {...query, role}
           }
        const user = await Model.findOne(query).select(select).populate(pathPopulate)
      
        if(!user){
          return next(new AppError("Couldn't find the user"), 404)
          }
      
                  res.status(200).json({status: "success", user})
          })
    )
