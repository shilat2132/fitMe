const mongoose = require('mongoose')
const AppError = require('../../utils/AppError')
const Vacation = require('../users/Vacation')
const utils = require("../../utils/utils")

const scheduleSchema = new mongoose.Schema({
    maxDaysForward: {
        type: Number,
        max: 60,
        required: [true, "עליך לספק שדה זה"]
    },
    days: {
        type: [Date],
        default: []
    },
    appointmentTime: { 
        workoutPeriod: {
            type: Number,
            default: 1
        },
        unit: {
            type: String,
            enum: ['h', 'm'], // 'h' for hours, 'm' for minutes
            default: 'h'
        }
    },
    workouts: {
        type: [String],
        default: []
    }
})




// SCHEMA METHODS

/**
 *  given a date, retrieves a list of trainers who are working on that day, along with their scheduled hours for the day.
 * 
 * @returns
 * - An array of trainer objects, each containing:
 *   - `_id`: Trainer's unique ID.
 *   - `name`: Trainer's name.
 *   - `workouts`: Array of workouts offered by the trainer.
 *   - `workingHours`: Trainer's working hours. object {start, end}, both are strings.
 *   - `scheduledHours`: Array of hours the trainer has appointments for that day.
 * - Returns `null` if no trainers are working on that day or an error occurs.
 * 
 * @throws {Error} Logs and returns `null` if an error occurs during the process.
 */
scheduleSchema.methods.getWorkingTrainers = async function(d){
    try {
        // get trainers that don't have a free day on that day, not in restingDay and not in a vacation
        const date = new Date(d)
        const currentDayNum = date.getDay()
        const trainersQuery = {
            restingDay: {$ne: currentDayNum},
            $or: [
                {vacations: {$size: 0}},
                {
                    vacations: {
                        $not: {
                            $elemMatch: {
                                from: { $lte: date },
                                to: { $gte: date},
                                status: "approved"
                            }
                        }
                    }
                }
            ]
        }
        const Trainer = await require('../users/Trainer');
        const trainers = await Trainer.find(trainersQuery).select("_id name workouts workingHours")
        if (!trainers || trainers.length ==0){
            return null
        }

        

        let finalTrainersArray = [] 
        for (const trainer of trainers) {
            const availableHours = await trainer.getAvailableHours(date, this.appointmentTime.workoutPeriod, this.appointmentTime.unit);
            if (availableHours.availableHours && availableHours.availableHours.length > 0) {
                const record = {
                    _id: trainer._id,
                    name: trainer.name,
                    workouts: trainer.workouts,
                    availableHours: availableHours.availableHours
                };
        
                finalTrainersArray.push(record);
            }
        }
    
        return finalTrainersArray
        
    } catch (error) {
        console.log("Error in the getWorkingTrainers method of scheduleSchema ", error)
        return null
    }
}


/**
 * creates the dates to add to the days arrays
 * @param numOfDays - the amount of dates to create, defaulted to the maxDaysForward field
 * @param currentDate - the date(object) to start the creation from, defaulted to today's date
 * 
 */
scheduleSchema.methods.datesCreation = function(numOfDays = null, currentDate= new Date()){
    if (!numOfDays){
        numOfDays = this.maxDaysForward
    }
    
    for (let i = 0; i < numOfDays; i++) {
        this.days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
}


/**
 * delete the dates, vacations and appointments up until the given index
 */
scheduleSchema.methods.deleteDates = async function (lastExistingDay, today){
    const Appointment = await require('./Appointment')
    const {start} = utils.startEndDay(today)

    // deletes all the vacations and appts that are before the start of today
    await Vacation.deleteMany({to: {$lt: start}})
    await Appointment.deleteMany({date: {$lt: start}})


    // delete the days before today from the array of the schedule

    // if all the days are before today - delete them all
    if (lastExistingDay< today){
        this.days = []
    }else{
        const i = this.days.findIndex(d=>{
            
            return d.toLocaleDateString()== today.toLocaleDateString()
        })


        if (i !=-1){
            // the new array would start from today's date
            this.days = this.days.slice(i) 
        }

    }

}

/**
 * updates the days field
 * - creates the dates that are missing, if needed
 * - deletes the dates, vacations and appointments before today
 * @returns 1 if successful and -1 otherwise
 */
scheduleSchema.methods.updateDays = async function () {
    const today = new Date()
    const lastExistingDay = this.days.at(-1)
    const lastActualDay = new Date() //the last day that's SUPPOSESED to be in the array
    lastActualDay.setDate(lastActualDay.getDate()+ this.maxDaysForward -1)

    lastActualDay.setUTCHours(0, 0, 0, 0)
    lastExistingDay.setUTCHours(0, 0, 0, 0)
    today.setUTCHours(0, 0, 0, 0)


    await this.deleteDates(lastExistingDay, today)


    if (lastExistingDay < today){
        // if all the days are before today, it would create maxForwardDays starting from today
         this.datesCreation()
         return
    }
    
    let amountOfDaysToAdd = utils.daysDifference(lastActualDay, lastExistingDay)

    if (amountOfDaysToAdd <= 0) return;

    // adding dates from the day after the last one
    let currentDate = new Date(lastExistingDay)
    currentDate.setDate(currentDate.getDate()+1)

    this.datesCreation(amountOfDaysToAdd +1, currentDate)

    
}


// SCHEMA MW


// A mw that creates the days array field for the number of days specified by `maxDaysForward`
scheduleSchema.pre("save", async function (next) {
    if (this.isNew){
        //Ensures there would be only one schedule
        const count = await this.constructor.countDocuments();
        if (count === 1) {
        return next(new AppError("Only one Schedule document is allowed", 400));
        }

       this.datesCreation()
    }
    next();
  });
  



/** a model of a schedule
 * @property maxDaysForward: Number of days to show forward in the schedule
 * @property appointmentTime: embedded schema with workoutPeriod field representing the amount of time for each appt and unit which is either 'h' or 'm'
 */
const Schedule = new mongoose.model("Schedule", scheduleSchema)

module.exports = Schedule