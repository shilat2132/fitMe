const express = require('express')
const router = express.Router()

const factory = require("../handlers/factory")
const Schedule = require('../models/time/Schedule')
const authMW = require("../handlers/auth/middlewares")


router.use(authMW.protect, authMW.restrictTo("manager", "trainer"))
// get the workout types for the trainer
const workoutsTypesFilter = req=> req.params.scheduleId
router.route("/:scheduleId")
    .get(factory.getOne(Schedule, workoutsTypesFilter, "workouts")) 


module.exports = router