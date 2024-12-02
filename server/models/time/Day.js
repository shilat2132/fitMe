const mongoose = require('mongoose')
const Trainer = require('../users/Trainer')
const catchAsync = require('../../utils/catchAsync')

const daySchema = new mongoose.Schema({
    date: {
        type: Date,
        require: [true, "you must provide a date"]
    },
    schedule:{
        type: mongoose.Schema.ObjectId,
        ref: 'Schedule',
        required: [true, 'a day must have a schedule']
    }
})


// schema's methods
daySchema.methods.getFreeApptsForCurrentDay = function(){
    // find the trainer that the current day isn't their free day and that day is not part of their vacation
    const dayNumber = this.date.getDay() //returns the number of the day between 0-6. sunday=0, monday= 1,...
    // retrives all the trainers that their free day is different from the current daty and that the current date 
        // isn't in the range of one of their vacations
    const query = {
        restingDay: {$ne: dayNumber}, 
        $or: [
            {vacations: {$size: 0}},
            {
                vacations:{
                    $not:{
                        $elemMatch: {
                            from: { $lte: this.date },
                            to: { $gte: this.date }
                        }
                    }
                }
            }
        ]
    }
    let trainers = catchAsync(Trainer.find(query))
}
module.exports = daySchema