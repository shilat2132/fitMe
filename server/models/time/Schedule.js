const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    maxDaysForward: {
        type: Number,
        required: [true, "עליך לספק שדה זה"]
    },
    appointmentTime: { 
        length: {
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


/** a model of a schedule
 * @property maxDaysForward: Number of days to show forward in the schedule
 * @property appointmentTime: embedded schema with length field representing the amount of time for each appt and unit which is either 'h' or 'm'
 */
const Schedule = new mongoose.model("Schedule", scheduleSchema)

module.exports = Schedule