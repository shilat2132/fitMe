const express = require('express')
const router = express.Router()

const utils = require("../utils/utils")

// handlers
const factory = require("../handlers/factory")
const authMW = require("../handlers/auth/middlewares")
const trainerHandlers = require("../handlers/users/trainerHandlers")
const apptsHandlers = require("../handlers/users/user/userAppts")
// const userHandlers = require("../handlers/users/user/userHandlers")

// model
const Appt = require("../models/time/Appointment")
const Schedule = require('../models/time/Schedule')
const Vacation = require('../models/users/Vacation')

router.use(authMW.protect, authMW.restrictTo("trainer"))

router.put("/updateWorkDetails", trainerHandlers.updateWorkDetails)
router.delete("/cancelAppt/:apptId", apptsHandlers.cancelAppt("trainer"))

// trainer - view all his scheduled workouts
const apptsFilter = (req) => ({trainer: req.user._id})
router.get("/appointments", factory.getAll(Appt, apptsFilter))

// trainer - view all his scheduled workouts for a specific day
const apptsForDay = req => {
    const {start, end} = utils.startEndDay(req.params.date)
    return {trainer: req.user._id, date: {
        $gte: start,
        $lte: end
    }}
}
router.get("/appointments/:date", factory.getAll(Appt, apptsForDay))

const vacationsFilter = req=> ({trainer: req.user._id})
router.route("/vacations").post(trainerHandlers.addVacation).get(factory.getAll(Vacation, vacationsFilter))


router.delete("/vacations/:vacId", trainerHandlers.cancelVacation)




module.exports = router