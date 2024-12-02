const mongoose = require('mongoose');

/** a schema for worker's vaction
 * @property from - a starting date for the vacation
 * @property to - an ending date for the vacation
 * @property description - the purpose of the vacation, defaulted to 'general'
 * @property isApproved - a boolean property set to false and refers to whether the vacation was approved by the manager
 */
const vacationSchema = new mongoose.Schema({
    from: {
        type: Date,
        required: [true, 'Starting day is required']
    },
    to: {
        type: Date,
        required: [true, 'Ending day is required'],
        validate: {
            validator: function (value) {
                return value>this.from;
            },
            message: 'Ending date of vacation must be after starting date'
        }
    },
    description: {
        type: String,
        default: 'general'
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});



module.exports = vacationSchema