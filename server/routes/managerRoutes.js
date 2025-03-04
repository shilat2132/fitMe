const express = require('express')
const router = express.Router()

const utils = require("../utils/utils")

// HANDLERS IMPORTS
const authMW = require("../handlers/auth/middlewares")
const factory = require("../handlers/factory")
const usersActions = require("../handlers/users/manager/usersActions")
const workoutsAction = require("../handlers/users/manager/workoutsActions")

// MODELS IMPORTS
const Trainer = require("../models/users/Trainer")
const User = require("../models/users/User")
const Appointment = require("../models/time/Appointment")
const Vacation = require('../models/users/Vacation')



router.use(authMW.protect, authMW.restrictTo("manager"))

    // USERS
        // TRAINERS
trainersRoutes = express.Router()

// get all trainers
trainersRoutes.get("/", factory.getAll(Trainer, ()=>({}) , "_id name email"))

// get all trainers' vacations - approved ones, sorted in ascending order of the starting dates
trainersRoutes.get("/vacations", factory.getAll(Vacation, req=> ({isApproved: "yes"}), null, { from: 1 }))

vacCallBack = req => ({id: req.params.vacId, update: {isApproved: req.body.isApproved ? req.body.isApproved : "Under review" }})
trainersRoutes
    .get("/vacations/toApprove", factory.getAll(Vacation, req=> ({isApproved: {$ne: "yes"}}))) // get vacations that need to be approved
    .put("/vacations/:vacId/update", factory.updateOne(Vacation, vacCallBack)) //update vacation's status


router.use("/trainers", trainersRoutes)

    // get all trainees
traineesFilter = req => ({role: "trainee"})
router.get("/trainees", factory.getAll(User, traineesFilter, "_id name email"))

// turn a user into a trainer
router.post("/users/:userId", usersActions.userToTrainer)


    // APPTS
// get appts for specific day
const workoutsFilter = req => {
    const {start, end} = utils.startEndDay(req.params.date)
    return {
        date: {
            $gte: start,
            $lte: end
        }
    }
}
router.get("/appointments/:date", factory.getAll(Appointment, workoutsFilter))

    // WORKOUTS
// add a workout type, delete
router.route("/workoutsTypes/:scheduleId")
    .put(workoutsAction.addWorkoutType)
    .delete(workoutsAction.deleteWorkoutsType)



module.exports = router