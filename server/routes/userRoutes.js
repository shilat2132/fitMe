



// handlers imports
const authMW = require("../handlers/auth/middlewares")
const apptsHandlers = require("../handlers/users/user/userAppts")
const authHandlers = require("../handlers/auth/authHandlers")
const passwordHandlers = require("../handlers/auth/passwordUpdating")
const userHandlers = require("../handlers/users/user/userHandlers")
const factory = require("../handlers/factory")


const express = require('express')
const { getAppts } = require("../handlers/users/trainerHandlers")
const router = express.Router()

router.post("/signup", authHandlers.signup)
router.post("/login", authHandlers.login)
router.get("/logout", authHandlers.logout)
router.post('/forgotPassword', passwordHandlers.forgotPassword)
router.patch('/resetPassword/:token', passwordHandlers.resetPassword)

router.use(authMW.protect)



router.route("/me")
    .get(userHandlers.getUser)
    .patch(userHandlers.updateMe)
    .delete(userHandlers.deleteUser("user"))

router.patch('/updatePassword', passwordHandlers.updatePassword)




module.exports = router
