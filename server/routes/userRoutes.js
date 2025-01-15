const express = require('express')
const router = express.Router()

// handlers imports
const factory = require("../handlers/factory")
const authMW = require("../handlers/auth/middlewares")
const apptsHandlers = require("../handlers/users/user/userAppts")
const authHandlers = require("../handlers/auth/authHandlers")
const passwordHandlers = require("../handlers/auth/passwordUpdating")
const userHandlers = require("../handlers/users/user/userHandlers")

router.post("/signup", authHandlers.signup)
router.post("/login", authHandlers.login)
router.get("/logout", authHandlers.logout)
router.post('/forgotPassword', passwordHandlers.forgotPassword)
router.patch('/resetPassword/:token', passwordHandlers.resetPassword)

router.use(authMW.protect)
router.route("me")
    .get(userHandlers.getUser)
    .patch(userHandlers.updateMe)
    .delete(userHandlers.deleteUser)



// routes restricted to users with the role of 'trainee'
router.use(authMW.restrictTo("trainee"))

router.get("/myAppts", apptsHandlers.getMyAppts)
router.post("/makeAnAppt", apptsHandlers.makeAnAppt) // make an appointment route
router.delete("/cancelAppt/:apptId", apptsHandlers.cancelAppt("trainee")) // cancel appointment route


