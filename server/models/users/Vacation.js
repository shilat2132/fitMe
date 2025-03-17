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

vacationSchema.pre(/^find/, function(next){
    this.populate({path: "trainer", select: "name email"})
    next()
})


/** 
 *  - checks whether there is an appointment scheduled in the range of dates of the vacation 
 *  - set the from to the beginning of the date, and to - to the end of the day
*/
vacationSchema.pre("save", async function(next){
    this.from.setUTCHours(0, 0, 0, 0)
    this.to.setUTCHours(23, 59, 59, 999)

    
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

// for when the manager tries to approve a vacation that has an appointment in its range
vacationSchema.pre("findOneAndUpdate", async function(next){
   const update = this.getUpdate()
   

    if(!update.status || (update.status && update.status !== "approved")) return next()
    
    const currentDoc = await this.model.findOne(this.getQuery());

    const Appt = await require('../time/Appointment')
    const appt = await Appt.findOne({
        date:{
            $gte: currentDoc.from,
            $lte: currentDoc.to
        },
        trainer: currentDoc.trainer
    })
    if(appt){
        return next(new AppError("This trainer has a scheduled appointment in this range of vacation", 409))
    }
    next()
})


// check wheather there is already a vacation in this range for the trainer
vacationSchema.pre('save', async function (next) {
    try {
        
        const existingVacation = await Vacation.findOne({
            trainer: this.trainer,
            from: this.from,
            to: this.to
        });

        if (existingVacation) {
            return next(new AppError('Vacation already exists for this trainer and date range.', 400));
        }

        next();
    } catch (error) {
        next(error)
    }
});


const Vacation = new mongoose.model('Vacation', vacationSchema)

module.exports = Vacation