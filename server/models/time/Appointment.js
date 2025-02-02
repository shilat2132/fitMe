const mongoose = require("mongoose")
const validator = require("validator")
const AppError = require("../../utils/AppError")
const Trainer = require("../users/Trainer")
const utils = require("../../utils/utils")

const apptSchema = new mongoose.Schema({
    date:{
        type: Date,
        // validate:{
        //     validator: function(date){
        //         return validator.isDate(date, {format: ["DD.MM.YYYY", "D.M.YYYY" ] , delimiters: [".", "/", "-"]})
        //     },
        //     message: "the date is not appropriately formatted in the appointment model"
        // },
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
    const Schedule = await require("./Schedule")
    console.log(Schedule)
    const schedule = await Schedule.findOne().select("workouts days")
    if (!schedule){
        return next(new AppError("you can't create an appointment while there isn't an existing schedule", 409))
    }

    // checks if the workout's type is one of the optional workouts
    if (!schedule.workouts.includes(this.workout)){
        return next(new AppError("the workout must be in the existing workouts of the schedule", 400))
    }

    // checks if the date is one of the available days of the schedule
    let d = this.date.toISOString().split("T")[0] //retrieves the date itself
    if (!schedule.days.some(day => day.toISOString().split("T")[0] === d)) {
        return next(new AppError("The given date isn't in the range of the opened dates of the schedule"));
    }
    next()
})


// APPOINTMENT METHODS
/**
 * a static method for checking whether an appointment for a given trainer is available 
 * - meanning it's not scheduled and not in a day of the trainer's vacation or rest day
* @param {Date} date - the date of the appointment to check
* @param hour - string hour of the appintment we want to check
* @param trainerId - the id of the trainer that we try to schedule to

*@returns true if appointment is free, else returns false. returns null if an error occur
*/
apptSchema.statics.isApptAvailable = async (date1, hour, trainerId)=>{
    try {
        // a query to find the trainer and make sure the given date is NOT in the range of ANY element of the vacations and not a rest day
        let date = new Date(date1)
        const weekDay = date.getDay()
        const query ={
            _id: trainerId,
            restingDay: {$ne: weekDay},
        }
        const trainer = await Trainer.findOne(query).populate("vacations").lean()
        
        if (!trainer){
            return false
        }

        const isOnVacation = trainer.vacations.some(vacation =>
            date >= vacation.from && date <= vacation.to
        )

        if (isOnVacation){
            return false
        }

        const {start, end} = utils.startEndDay(date)
        const appt = await this.findOne({
            date: {
                $gte: start,
                $lte: end
            }, 
            trainer: trainerId, 
            hour: hour}
        ).select("_id").lean()
        return !appt
    } catch (error) {
        console.log("An error occured in isApptAvailable function  ", error)
        return null
    }
}

const Appointment = new mongoose.model('Appointment', apptSchema)

module.exports = Appointment
