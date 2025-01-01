const express = require('express')
const router = express.Router()

// handlers
const factory = require("../handlers/factory")
const authMW = require("../handlers/auth/middlewares")
const trainerHandlers = require("../handlers/users/trainerHandlers")

// model
const Appt = require("../models/time/Appointment")
const Trainer = require("../models/users/Trainer")

router.use(authMW.protect, authMW.restrictTo("trainer"))

const apptsFilter = (req) => ({trainer: req.user._id})
router.get("/appointments", factory.getAll(Appt, apptsFilter))

const apptsForDay = req => ({trainer: req.user._id, date: req.params.dateId})
router.get("/appointments/:dateId", factory.getAll(Appt, apptsForDay))

router.route("/vacations").post(trainerHandlers.addVacation)