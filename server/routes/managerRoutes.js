const express = require('express')
const router = express.Router()


// HANDLERS IMPORTS
const authMW = require("../handlers/auth/middlewares")
const factory = require("../handlers/factory")
const usersActions = require("../handlers/users/manager/usersActions")
const workoutsAction = require("../handlers/users/manager/workoutsActions")

// MODELS IMPORTS
const Trainer = require("../models/users/Trainer")
const User = require("../models/users/User")
const Vacation = require('../models/users/Vacation')
const { deleteUser } = require('../handlers/users/user/userHandlers')
// const { default: trainerRouter } = require('../../client/src/pages/trainers/trainersRouter')



router.use(authMW.protect, authMW.restrictTo("manager"))

    // USERS
        // TRAINERS
const trainersRoutes = express.Router()

// get all trainers
trainersRoutes.get("/", factory.getAll(Trainer, ()=>({}) , "_id name"))



// get all trainers' vacations - approved ones, sorted in ascending order of the starting dates
trainersRoutes.get("/vacations", factory.getAll(Vacation, req=> ({status: "approved"}), null, { from: 1 }))

vacCallBack = req => ({id: req.params.vacId, update: {status: req.body.status ? req.body.status : "Under review" }})
trainersRoutes
    .get("/vacations/toApprove", factory.getAll(Vacation, req=> ({status: {$ne: "approved"}}))) // get vacations that need to be approved
    .put("/vacations/:vacId/update", factory.updateOne(Vacation, vacCallBack)) //update vacation's status


    // get a specific trainer
trainersRoutes.route("/:id")
    .get(usersActions.getUser(Trainer, "-isNewPasswordEncrypted -__v -__t", "trainer", "vacations"))
   



router.use("/trainers", trainersRoutes)

    // get all trainees
traineesFilter = req => ({role: "trainee"})
router.get("/trainees", factory.getAll(User, traineesFilter, "_id name"))
router.route("/trainees/:id").get(usersActions.getUser(User, "name email _id phone role", "trainee", "appointments"))


// turn a user into a trainer
router.post("/users/:userId", usersActions.userToTrainer)

router.delete("/users/:id", deleteUser("manager"))



    // WORKOUTS
// add a workout type, delete
router.route("/workoutsTypes/:scheduleId")
    .put(workoutsAction.addWorkoutType)
    .delete(workoutsAction.deleteWorkoutsType)



module.exports = router