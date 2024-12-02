const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    maxDaysForward: {
        type: Number,
        required: [true, "עליך לספק שדה זה"]
    },
    apptLength: {
        type: Number,
        required: [true, "עליך לספק שדה זה"]
    },
    timeUnit: {
        type: String,
        enum: ['h', 'm'],
        default: 'h'
    }
})


/** a model of a schedule
 * @property maxDaysForward: Number of days to show forward in the schedule
 */
const Schedule = new mongoose.model("Schedule", scheduleSchema)

module.exports = Schedule