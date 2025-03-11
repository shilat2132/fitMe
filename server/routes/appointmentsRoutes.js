const express = require('express')
const router = express.Router()

const apptsHandlers = require("../handlers/users/user/userAppts")
const { getAppts } = require('../handlers/users/trainerHandlers')
const authMW = require("../handlers/auth/middlewares")



router.use(authMW.protect)

router.delete("/cancelAppt/:apptId", apptsHandlers.cancelAppt)

// for all type of users. if it's a manager it would get all the appts, if it's a trainer - only the appts for him, if it's a trainee - only his appts
router.get("/", getAppts )

// routes restricted to users with the role of 'trainee'
router.use(authMW.restrictTo("trainee"))

router.post("/makeAnAppt", apptsHandlers.makeAnAppt) // make an appointment route


module.exports = router