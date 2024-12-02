const mongoose = require('mongoose')

const User = require("./User")
const constants = require('../../constants')
const vacationSchema = require('./Vacation')

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
                    return value>this.workingHours.start;
                },
                message: 'End time must be after start hour'
            }
        }
    },
    restingDay: Number,
    vacations: [vacationSchema]

})


const Trainer = User.discriminator('Trainer', trainerSchema);

module.exports = Trainer