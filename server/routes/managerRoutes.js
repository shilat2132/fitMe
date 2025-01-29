const express = require('express')
const router = express.Router()

// HANDLERS IMPORTS
const authMW = require("../handlers/auth/middlewares")
const factory = require("../handlers/factory")
const usersActions = require("../handlers/manager/usersActions")

// MODELS IMPORTS
const Trainer = require("../models/users/Trainer")
const User = require("../models/users/User")
const Appointment = require("../models/time/Appointment")



router.use(authMW.protect, authMW.restrictTo("manager"))

    // USERS
// get all trainers
router.get("/trainers", factory.getAll(Trainer, ()=>({}) , "_id name"))

// get all trainees
traineesFilter = req => ({role: "trainee"})
router.get("/trainees", factory.getAll(User), traineesFilter, "_id name")


// turn a user into a trainer
router.post("/users/:userId", usersActions.userToTrainer)


    // APPTS
// get appts for specific day
const workoutsFilter = req => ({_id: req.params.dayId})
router.get("/workouts/:dayId", factory.getAll(Appointment, workoutsFilter))

    // SCHEDULE
// update schedule

// create schedule


// delete schedule

    // VACATIONS
// get all vacations


// list of vacations to approve


// approve vacation


    // WORKOUTS
// add a workout type


// delete a workout type
