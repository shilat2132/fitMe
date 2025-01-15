const express = require('express')
const router = express.Router()

// handlers
const factory = require("../handlers/factory")
const authMW = require("../handlers/auth/middlewares")
const trainerHandlers = require("../handlers/users/trainerHandlers")
const apptsHandlers = require("../handlers/users/user/userAppts")

// model
const Appt = require("../models/time/Appointment")
const Trainer = require("../models/users/Trainer")

router.use(authMW.protect, authMW.restrictTo("trainer"))

router.delete("/cancelAppt/:apptId", apptsHandlers.cancelAppt("trainer"))

// trainer - view all his scheduled workouts
const apptsFilter = (req) => ({trainer: req.user._id})
router.get("/appointments", factory.getAll(Appt, apptsFilter))

// trainer - view all his scheduled workouts for a specific day
const apptsForDay = req => ({trainer: req.user._id, date: req.params.dateId})
router.get("/appointments/:dateId", factory.getAll(Appt, apptsForDay))

const vacationsFilter = req=> req.user._id
router.route("/vacations").put(trainerHandlers.addVacation).get(factory.getOne(Trainer, vacationsFilter, "vacations"))


router.put("/vacations/:vacId", trainerHandlers.cancelVacation)