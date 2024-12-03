const mongoose = require('mongoose')
const validator = require("validator")
const User = require("./User")
const constants = require('../../utils/constants')
const vacationSchema = require('./Vacation')

const trainerSchema = new mongoose.Schema({
    workouts: [{type: String, enum: constants.WORKOUTS} ],
    workingHours: {
        start: {
            type: String,
            required: [true, 'Start time is required'],
            validate:{
                validator: function(value){
                    return validator.isTime(value)
                },
                message: "starting time needs to be formatted as hour:minutes and the hour needs to be between 0 and 23"
            }
            
        },
        end: {
            type: String,
            required: [true, 'End time is required'],
            validate: {
                validator: function (value) {
                    if (!value.contains(":")){
                        return false
                    }
                    const intHour = parseInt(value.split(":")[0])
                    const startIntHour = parseInt(this.workingHours.start.split(":")[0])
                    return validator.isTime(value) && value>startIntHour
                },
                message: "ending time needs to be formatted as hour:minutes and the hour needs to be between 0 and 23. and it should be greater than the start"

            }
        }
    },
    restingDay: Number,
    vacations: {
        type: [vacationSchema],
        default:[]
    }

})


const Trainer = User.discriminator('Trainer', trainerSchema);

module.exports = Trainer