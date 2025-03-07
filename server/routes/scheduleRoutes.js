const express = require('express')
const router = express.Router()

// HANDLERS IMPORTS
const authMW = require("../handlers/auth/middlewares")
const scheduleActions = require("../handlers/users/manager/scheduleActions")




router.get("/", scheduleActions.getSchedule)
router.get("/:date", scheduleActions.getTrainersForDay)


router.use(authMW.protect, authMW.restrictTo("manager"))
router.route("/")
    .delete(scheduleActions.deleteSchedule)
    .patch(scheduleActions.updateSchedule)
    .post(scheduleActions.createSchedule)

module.exports = router