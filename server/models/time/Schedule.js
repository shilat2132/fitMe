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
    days:{
        type: [Date],
        // validate:{
        //         validator: function(dates){
        //             return dates.every(date => validator.isDate(date, {delimiters: [".", "/", "-"]}))
        //         },
        //         message: "one of the days is not appropriately formatted as a date"
        //     }
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
scheduleSchema.methods.getWorkingTrainers = async function(date){
    try {
        // get trainers that don't have a free day on that day, not in restingDay and not in a vacation
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
                                to: { $gte: date}
                            }
                        }
                    }
                }
            ]
        }
        const Trainer = await require('../users/Trainer');
        const trainers = await Trainer.find(trainersQuery).select("_id name workouts workingHours").lean()
        if (!trainers || trainers.length ==0){
            return null
        }

        const {start, end} = utils.startEndDay(date)
        
        const Appointment = await require('./Appointment')

        // retrives all the appointments for today
        const appts = await Appointment.find({
            date: {
                $gte: start,
                $lte: end
            }
        }).select("trainer hour").lean()
        
        // map each appointment to a trainer
       const trainersHoursDict = {}
       if (appts && appts.length > 0){
            let trainerId;
            appts.forEach(appt=>{
                trainerId = appt.trainer._id.toString()
                if (!trainersHoursDict[trainerId]) trainersHoursDict[trainerId] = []
                trainersHoursDict[trainerId].push(appt.hour)
            })
       }

        const finalTrainersArray = trainers.map(trainer=>(
            {
                ...trainer,
                scheduledHours: trainersHoursDict[trainer._id] || []
            }
        ))
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
 * @returns days - the array of the dates
 */
scheduleSchema.methods.datesCreation = function(numOfDays = null, currentDate= new Date()){
    if (!numOfDays){
        numOfDays = this.maxDaysForward
    }
    const days = [];
    for (let i = 0; i < numOfDays; i++) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return days
}


/**
 * delete the dates, vacations and appointments up until the given index
 */
scheduleSchema.methods.deleteDates = async amountOfDaysToDelete=>{
    const Appointment = await require('./Appointment')

    for(i=0; i<amountOfDaysToDelete; i++){
        const currentDate = this.days[i]
        const {start, end} = utils.startEndDay(currentDate)
        await Appointment.deleteMany({date: {$gte: start, $lte: end }})

        await Vacation.deleteMany({to: {$lt: end}})
    }

    if(amountOfDaysToDelete != this.days.length){
        this.days = this.days.slice(amountOfDaysToDelete)
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
    lastActualDay.setDate(lastActualDay.getDate()+ this.maxDaysForward)

    lastActualDay.setUTCHours(0, 0, 0, 0)
    lastExistingDay.setUTCHours(0, 0, 0, 0)
    today.setUTCHours(0, 0, 0, 0)

    // checks if you need to update the dates
    if (lastExistingDay <lastActualDay){
        
         // if today is the last existing day - don't remove it, remove all the days before it
        if(today == lastExistingDay){
             await this.deleteDates(this.days.length-1)

             const startDate = new Date(today)
             startDate.setDate(startDate.getDate()+1)

             const dates = this.datesCreation(this.maxDaysForward -1, startDate)
             this.days.push(...dates) 
             return 1;
        }

         // if there aren't any dates from today and after today, start from today and create maxDaysForward dates
            // delete all the vacations and appointments before today
        if (lastExistingDay< today){
            await this.deleteDates(this.days.length) //delete all the array
            this.days = this.datesCreation()
            return 1
        }else{
            const num = this.days.findIndex(d=>{
                d.setUTCHours(0,0,0,0)
                return d== today
            })

            if (num !=-1){
                await this.deleteDates(num)
            }
            let amountOfDaysToCreate = (lastActualDay-lastExistingDay)/ (1000 * 3600 * 24) //get the days differance between the last date to the existing last date
            amountOfDaysToCreate = Math.round(amountOfDaysToCreate)
            lastExistingDay.setDate(lastExistingDay.getDate()+1) //to start the dates to be created from the day after the last existing date

            const dates = this.datesCreation(amountOfDaysToCreate, lastExistingDay)
            this.days.push(...dates) 
            return 1   
        }
    }  else{
        return -1 //if the last existing date is after the last date that should be, it means that the user's trying to update the maxDaysForward field to a smaller number than before, and that's not allowed
    }
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

        const dates = this.datesCreation()
        this.days = dates 
    }
    next();
  });
  

/** a method that would be triggered everyday. remove the former day and create another one. */
// scheduleSchema.methods.newDayHandler = async function(){
//     try {
//         const yesterday = new Date()
//         yesterday.setDate(yesterday.getDate()-1)
//         await Day.findOneAndDelete({date: yesterday, schedule: this._id})
//         const lastDay = new Date()
//         lastDay.setDate(lastDay.getDate()+ this.maxDaysForward)
//         await Day.create({date: lastDay, schedule: this._id})
//     } catch (error) {
//         console.log("Error occured in scheduleSchema in the newDayHandler method ", error)
//     }
// }

/** a model of a schedule
 * @property maxDaysForward: Number of days to show forward in the schedule
 * @property appointmentTime: embedded schema with workoutPeriod field representing the amount of time for each appt and unit which is either 'h' or 'm'
 */
const Schedule = new mongoose.model("Schedule", scheduleSchema)

module.exports = Schedule