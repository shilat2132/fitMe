const mongoose = require('mongoose');

// Define the vacation schema
const vacationSchema = new mongoose.Schema({
    from: {
        type: Date,
        required: [true, 'Starting day is required']
    },
    to: {
        type: Date,
        required: [true, 'Ending day is required']
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



module.exports = Vacation