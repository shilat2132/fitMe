const mongoose = require('mongoose')
const validator = require("validator")
const User = require("./User")
const constants = require('../../utils/constants')
const vacationSchema = require('./Vacation')


/** a class that inherits from user.
 * @property workouts: an array of strings from the workouts array enum
 * @property workingHours: embedded schema with a string start time and end time of the trainer’s day
 * @property restingDay: a numeric field representing the number of the day that is the trainer’s free day
 * @property vacations: an array of vacation’s schema: from and to fields of dates. description and isApproved(boolean, defaulted to false)
 */
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
                    const intHour = parseInt(value.split(":")[0])
                    const startIntHour = parseInt(this.workingHours.start.split(":")[0])
                    return validator.isTime(value) && intHour>startIntHour
                },
                message: "ending time needs to be formatted as hour:minutes and the hour needs to be between 0 and 23. and it should be greater than the start"

            }
        }
    },
    restingDay: {
        type: Number,
        min: 0,
        max: 6
    },
})

trainerSchema.virtual("vacations", {
    ref: 'Vacation',
    foreignField: "trainer",
    localField: "_id"
})

const Trainer = User.discriminator('Trainer', trainerSchema);

module.exports = Trainer