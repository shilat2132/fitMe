const express = require('express')
const router = express.Router()

// HANDLERS IMPORTS
const authMW = require("../handlers/auth/middlewares")
const factory = require("../handlers/factory")
const Schedule = require('../models/time/Schedule')
const scheduleActions = require("../handlers/users/manager/scheduleActions")

router.route(":scheduleId")
    .get(factory.getOne(Schedule, req=> req.params.scheduleId))

router.use(authMW.protect, authMW.restrictTo("manager"))
router.route("")
    .delete(scheduleActions.deleteSchedule)
    .patch(scheduleActions.updateSchedule)



module.exports = router