const express = require('express')
const router = express.Router()


// handlers
const factory = require("../handlers/factory")
const authMW = require("../handlers/auth/middlewares")
const trainerHandlers = require("../handlers/users/trainerHandlers")

// model
const Vacation = require('../models/users/Vacation')

router.use(authMW.protect, authMW.restrictTo("trainer"))

router.put("/updateWorkDetails", trainerHandlers.updateWorkDetails)





const vacationsFilter = req=> ({trainer: req.user._id})
router.route("/vacations").post(trainerHandlers.addVacation).get(factory.getAll(Vacation, vacationsFilter))


router.delete("/vacations/:vacId", trainerHandlers.cancelVacation)




module.exports = router