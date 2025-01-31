const express = require('express')
const router = express.Router()

// HANDLERS IMPORTS
const authMW = require("../handlers/auth/middlewares")
const factory = require("../handlers/factory")
const Schedule = require('../models/time/Schedule')

router.route("schedule/:scheduleId").get(factory.getOne(Schedule, req=> req.params.scheduleId))