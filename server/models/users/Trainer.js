const mongoose = require('mongoose')
const validator = require("validator")
const User = require("./User")
const { getHoursArr } = require('../../utils/utils')
const utils = require("../../utils/utils")

/** a class that inherits from user.
 * @property workouts: an array of strings from the workouts array enum
 * @property workingHours: embedded schema with a string start time and end time of the trainer’s day
 * @property restingDay: a numeric field representing the number of the day that is the trainer’s free day
 * @property vacations: an array of vacation’s schema: from and to fields of dates. description and isApproved(boolean, defaulted to false)
 */
const trainerSchema = new mongoose.Schema({
    workouts: [String],
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
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

trainerSchema.virtual("vacations", {
    ref: 'Vacation',
    foreignField: "trainer",
    localField: "_id"
})



/** given a d(date) and period (int, optional) and unit ('h' or 'm', optional):
 *  - creates an array of string hours that are available for the trainer in the given day, and are not scheduled
 * @returns {object} {status: "success", availableHours} or {status: "success", error}
 */
trainerSchema.methods.getAvailableHours = async function(d, period = null, unit=null){
   try {
    
     // retrieve his appts for the day
     const Appointment = await require('../time/Appointment')
     const date = new Date(d)
     const {start, end} = utils.startEndDay(date) 
     
     
     const appts = await Appointment.find({
         trainer: this._id,
         date: {$gte: start, $lte: end}
             }).select("hour").lean()
    
     // create an array of scheduled hours for that day
     const scheduledHours = appts.map(appt=> appt.hour)

     // create an array of the hours he works at
    
 
     let workoutPeriod, workoutUnit
     if (!period && !unit){
        
         const Schedule = await require('../time/Schedule')
         const schedule = await Schedule.findOne().select("appointmentTime")
 
         if (!schedule){
             return null
         }
     
         workoutPeriod = schedule.appointmentTime.workoutPeriod
         workoutUnit = schedule.appointmentTime.unit
     }else{
        workoutPeriod = period
        workoutUnit = unit
     }
    
     const hours = getHoursArr(this.workingHours.start, this.workingHours.end, workoutPeriod, workoutUnit)
     
      // remove the hours that are scheduled
     const availableHours = hours.filter(h=> !scheduledHours.includes(h))
     return {status: "success", availableHours}

   } catch (error) {
    console.log(error)
        return {status: "error", error}
   }
}

/**
 * this mw filters the trainer's workouts field(if modified) to have only the workouts that are in the general workouts types 
 */
trainerSchema.pre("save", async function (next) {
    
    if (!this.workouts) {
        return next()
    }

    const Schedule = await require('../time/Schedule')
    const schedule = await Schedule.findOne().select("workouts");
    if (!schedule) return next();

    const workoutTypes = new Set(schedule.workouts);

    this.workouts = this.workouts.filter(workout => workoutTypes.has(workout))

    next()
});

trainerSchema.pre( /^findOneAnd/, async function (next) {
    let update = this.getUpdate()

    if (!update.$addToSet || !update.$addToSet.workouts) {
        return next()
    }

    const Schedule = await require('../time/Schedule')
    let workoutTypes = await Schedule.findOne().select("workouts")
    if (!workoutTypes) return next();

    workoutTypes = new Set(workoutTypes.workouts);
    update.$addToSet.workouts.$each = update.$addToSet.workouts.$each.filter(workout => workoutTypes.has(workout));
    
    this.setUpdate(update)
    next();
})



const Trainer = User.discriminator('Trainer', trainerSchema);

module.exports = Trainer