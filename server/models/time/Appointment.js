const mongoose = require("mongoose")
const validator = require("validator")
const constants = require("../../utils/constants")


const apptSchema = new mongoose.Schema({
    date:{
        type: mongoose.Schema.ObjectId,
        ref: 'Day',
        required: [true, 'an appointment must have a day']
    },
    trainer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Trainer',
        required: [true, 'an appointment must have a trainer']
    },
    hour:{
        type: String,
        required: [true, 'Start time is required'],
        validate:{
            validator: function(value){
                return validator.isTime(value)
            },
            message: "appointment time needs to be formatted as hour:minutes and the hour needs to be between 0 and 23"
        }
    },
    trainee:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'an appointment must have a user']
    },
    workout:{
        type: String,
        enum: constants.WORKOUTS
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


//QUERY MW
apptSchema.pre(/^find/, function(next){
    this.populate({path: 'date', select: 'day schedule'})
    .populate({path: 'trainee', select: 'name phone email'}).populate({path: 'trainer', select: "name"})
    next()
})

const Appointment = new mongoose.model('Appointment', apptSchema)

module.exports = Appointment
