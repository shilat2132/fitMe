const express = require('express')
const router = express.Router()

// handlers
const factory = require("../handlers/factory")
const authMW = require("../handlers/auth/middlewares")
const trainerHandlers = require("../handlers/users/trainerHandlers")
const apptsHandlers = require("../handlers/users/user/userAppts")
// const userHandlers = require("../handlers/users/user/userHandlers")

// model
const Appt = require("../models/time/Appointment")
const Trainer = require("../models/users/Trainer")
const Schedule = require('../models/time/Schedule')

router.use(authMW.protect, authMW.restrictTo("trainer"))

router.put("updateWorkDetails", trainerHandlers.updateWorkDetails)
router.delete("cancelAppt/:apptId", apptsHandlers.cancelAppt("trainer"))

// trainer - view all his scheduled workouts
const apptsFilter = (req) => ({trainer: req.user._id})
router.get("appointments", factory.getAll(Appt, apptsFilter))

// trainer - view all his scheduled workouts for a specific day
const apptsForDay = req => ({trainer: req.user._id, date: req.params.dateId})
router.get("appointments/:dateId", factory.getAll(Appt, apptsForDay))

const vacationsFilter = req=> ({trainer: req.user._id})
router.route("vacations").post(trainerHandlers.addVacation).get(factory.getAll(Trainer, vacationsFilter, "-trainer"))


router.delete("vacations/:vacId", trainerHandlers.cancelVacation)


// get the workout types for the trainer
const workoutsTypesFilter = req=> req.params.scheduleId
router.route("workoutsTypes/:scheduleId")
    .get(factory.getOne(Schedule, workoutsTypesFilter, "workouts"))

module.exports = router