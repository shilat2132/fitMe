const mongoose = require('mongoose')
const Day = require("./Day")


const scheduleSchema = new mongoose.Schema({
    maxDaysForward: {
        type: Number,
        required: [true, "עליך לספק שדה זה"]
    },
    appointmentTime: { 
        workoutPeriod: {
            type: Number,
            required: [true, "עליך לספק את אורך הפגישה"]
        },
        unit: {
            type: String,
            enum: ['h', 'm'], // 'h' for hours, 'm' for minutes
            default: 'h'
        }
    }
})

// SCHEMA METHODS

/** A method that creates day documents for the number of days specified by `maxDaysForward`.*/
scheduleSchema.methods.initiateScheduleDays = async function(){
    try {
        const numOfDays = this.maxDaysForward
        const daysToCreate = [];
        let currentDate = new Date();
        let dateCopy
        for (let i = 0; i < numOfDays; i++) {
            dateCopy = new Date(currentDate);
            daysToCreate.push({ date: dateCopy, schedule: this._id });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        await Day.insertMany(daysToCreate);

    } catch (error) {
        console.log("error in the scheduleSchema in initiateScheduleDays method ", error)
    }
}

// a method that would be triggered everyday. remove the former day and create another one.


/** a model of a schedule
 * @property maxDaysForward: Number of days to show forward in the schedule
 * @property appointmentTime: embedded schema with workoutPeriod field representing the amount of time for each appt and unit which is either 'h' or 'm'
 */
const Schedule = new mongoose.model("Schedule", scheduleSchema)

module.exports = Schedule