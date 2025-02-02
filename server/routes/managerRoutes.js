const express = require('express')
const router = express.Router()

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
const Schedule = require('../models/time/Schedule')



router.use(authMW.protect, authMW.restrictTo("manager"))

    // USERS
        // TRAINERS
trainersRoutes = express.Router()

// get all trainers
trainersRoutes.get("", factory.getAll(Trainer, ()=>({}) , "_id name"))

// get all trainers' vacations
trainersRoutes.get("vacations", factory.getAll(Vacation, req=> {isApproved: "yes"}, null, { from: 1 }))

vacCallBack = req => ({id: req.params.vacId, update: {isApproved: req.body.approve ? req.body.approve : "Under review" }})
trainersRoutes
    .get("vacations/toApprove", factory.getAll(Vacation, {isApproved: {$ne: "yes"}})) // get vacations that need to be approved
    .put("vacations/:vacId/update", factory.updateOne(Vacation, vacCallBack)) //update vacation's status


router.use("trainers", trainersRoutes)

    // get all trainees
traineesFilter = req => ({role: "trainee"})
router.get("trainees", factory.getAll(User, traineesFilter, "_id name"))

// turn a user into a trainer
router.post("users/:userId", usersActions.userToTrainer)


    // APPTS
// get appts for specific day
const workoutsFilter = req => ({date: req.params.date})
router.get("appointments/:date", factory.getAll(Appointment, workoutsFilter))

    // WORKOUTS
// add a workout type, get workouts types
const workoutsTypesFilter = req=> req.params.scheduleId
router.route("workoutsTypes/:scheduleId")
    .get(factory.getOne(Schedule, workoutsTypesFilter, "workouts"))
    .put(workoutsAction.addWorkoutType)
    .delete(workoutsAction.deleteWorkoutsType)



module.exports = router