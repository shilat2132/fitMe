const mongoose = require('mongoose')

const User = require("./User")
const constants = require('../../constants')
const Vacation = require('./Vacation')

const trainerSchema = new mongoose.Schema({
    workouts: [{type: String, enum: constants.WORKOUTS} ],
    workingHours: {
        start: {
            type: Number,
            required: [true, 'Start time is required'],
            min: [0, 'Start time must be between 0 and 23'],
            max: [23, 'Start time must be between 0 and 23']
        },
        end: {
            type: Number,
            required: [true, 'End time is required'],
            min: [0, 'End time must be between 0 and 23'],
            max: [23, 'End time must be between 0 and 23'],
            validate: {
                validator: function (value) {
                    // Validate that end is a valid time (0-23)
                    return value >= 0 && value <= 23;
                },
                message: 'End time must be a valid hour between 0 and 23'
            }
        }
    },
    restingDay: Number,
    vacations: [Vacation]

})


const Trainer = User.discriminator('Trainer', trainerSchema);