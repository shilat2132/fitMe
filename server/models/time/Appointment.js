const mongoose = require("mongoose")
const validator = require("validator")
const AppError = require("../../utils/AppError")
const Trainer = require("../users/Trainer")
const utils = require("../../utils/utils")

const apptSchema = new mongoose.Schema({
    date:{
        type: Date,
        index: true,
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
    workout: {
        type: String,
        required: [true, "a scheduled workout must have the workout type"]
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


//QUERY MW
apptSchema.pre(/^find/, function(next){
    this.populate({path: 'trainee', select: 'name phone email'})
    .populate({path: 'trainer', select: "name"})
    next()
})

apptSchema.pre("save", async function(next){

    this.date = utils.clearTime(this.date)
    next()
})


// APPOINTMENT METHODS
/**
 * a static method for checking whether an appointment for a given trainer is available 
 * - meanning it's not scheduled and not in a day of the trainer's vacation or rest day,
 *  and the required workout is given by that trainer, and the required date is in the allowed range of opened dates


*@returns true if appointment is free, else returns false. returns null if an error occur
*/
apptSchema.statics.isApptAvailable = async (date1, hour, trainerId, workout)=>{
    try {
        // a query to find the trainer and make sure the given date is NOT in the range of ANY element of the vacations and not a rest day
        let date = new Date(date1)

        const Schedule = await require("./Schedule")
        const schedule = await Schedule.findOne().select("days maxDaysForward")
        if (!schedule){
            return {result: false, message: "you can't create an appointment while there isn't an existing schedule"}
        }
    
        // checks if the date is one of the available days of the schedule
           const today = new Date()
           const {start} = utils.startEndDay(today)
       
           const lastDay = new Date()
           lastDay.setDate(lastDay.getDate()+schedule.maxDaysForward)
           const {end} = utils.startEndDay(lastDay)
           
           if (!(date>= start && date<=end)) {
            return {result: false, message: "The given date isn't in the range of the opened dates of the schedule"}
        }

        const weekDay = date.getDay()
        const query ={
            _id: trainerId,
            restingDay: {$ne: weekDay},
            workouts: workout

        }
        const trainer = await Trainer.findOne(query).populate("vacations")
        if (!trainer){
            return {result: false, message: "Either the trainer doesn't exist, or the given appointment's date is his resting day, or he doesn't train the required workout"}
        }

        let hours = await trainer.getAvailableHours(date)
        hours = hours.availableHours 
        if (!hours || (hours && !hours.includes(hour))){
            return {result: false, message: "The required hour isn't available with this trainer"}
        }

        const isOnVacation = trainer.vacations.some(vacation =>
            date >= vacation.from && date <= vacation.to && vacation.status == "approved"
        )

        if (isOnVacation){
            return {result: false, message: "the trainer is on vacation on the required date"}
        }

      
        return {result: true}

    } catch (error) {
        return {result: false, error}
    }
}

const Appointment = new mongoose.model('Appointment', apptSchema)

module.exports = Appointment
