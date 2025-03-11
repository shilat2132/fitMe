const mongoose = require('mongoose');
const AppError = require('../../utils/AppError');

/** a schema for worker's vaction
 * @property schedule - a ref field to the schedule
 * @property from - a starting date for the vacation
 * @property to - an ending date for the vacation
 * @property description - the purpose of the vacation, defaulted to 'general'
 * @property status - a boolean property set to false and refers to whether the vacation was approved by the manager
 */
const vacationSchema = new mongoose.Schema({
    trainer:{
        type: mongoose.Schema.ObjectId,
        ref: 'Trainer',
        required: [true, 'a vacation must have a trainer that the vacation is his']
    },
    // schedule:{
    //         type: mongoose.Schema.ObjectId,
    //         ref: 'Schedule',
    //         required: [true, 'a vacation must have a schedule']
    //     },
    from: {
        type: Date,
        required: [true, 'Starting day is required']
    },
    to: {
        type: Date,
        required: [true, 'Ending day is required'],
        validate: {
            validator: function (value) {
                return value>=this.from;
            },
            message: 'Ending date of vacation must be after starting date'
        }
    },
    description: {
        type: String,
        default: 'general'
    },
    status: {
        type: String,
        enum: ["approved", "not approved", "Under review"],
        default: "Under review"
    }
});

vacationSchema.pre("save", async function(next){
    this.from.setUTCHours(0, 0, 0, 1)
    this.to.setUTCHours(23, 59, 59, 999)

    // checks whether there is an appointment scheduled in the range of dates of the vacation
    const Appt = await require('../time/Appointment')
    const appt = await Appt.findOne({
        date:{
            $gte: this.from,
            $lte: this.to
        },
        trainer: this.trainer
    })

    if(appt){
        return next(new AppError("You have a scheduled appointment in this range of vacation", 409))
    }
    next()
})

vacationSchema.pre(/^find/, function(next){
    this.populate({path: "trainer", select: "name email"})
    next()
})
const Vacation = new mongoose.model('Vacation', vacationSchema)

module.exports = Vacation