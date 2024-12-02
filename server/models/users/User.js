const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'a name is required']
    },
    email: {
        type: String,
        require: [true, 'an email is required'],
        unique: true,
        validate: [validator.isEmail, 'please provide valid email']
    },
    phone: {
        type: String,
        required: [true, 'a phone number is required'],
        validate:{
            validator: function (val){
                return val.length === 10
            },
            message: 'מספר פלאפון אמור להכיל 10 ספרות'
        }
    },
    role:{
        type: String,
        require: true,
        enum: ['admin', 'trainer', 'trainee'],
        default: 'trainee'
    },
 
    password: {
        type: String,
        require: [true, 'a password is required'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        require: [true, 'a password confirm is required'],
        validate: {
            validator: function(val){
                return this.password === val
            },
            message: 'הסיסמאות לא זהות'
        }
    },
    passwordChangedAt: Date, 
    passwordResetToken: String,
    passwordResetTokenExpires: Date
},
{
    discriminatorKey: 'role'
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


//virtual populate
// userSchema.virtual('appointments', {
//     ref: "Appt",
//     foreignField: "user",
//     localField: "_id"
// })

//SCHEMA METHODS

/** 
 * Compares a candidate password with the user's stored hashed password.
 * @param {string} candidatePassword - The password provided by the user.
 * @param {string} userPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
userSchema.methods.correctPassword = async function (candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

/** 
 * Checks if the user changed their password after a given JWT timestamp.
 * @param {number} JWTTimestamp - The timestamp when the JWT was issued.
 * @returns {boolean} - True if the password was changed after the token was issued.
 */
userSchema.methods.changedPasswordAfter= function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000) //converts the time the password was changed to timestamp
        return changedTimestamp> JWTTimestamp // returns true if password was changed after the token was issued
    }
    return false //password wasn't changed after token was issued
}

/** 
 * Creates a secure password reset token and sets the hashed version in the database.
 * @returns {string} - The reset token to be sent to the user.
 */
userSchema.methods.createPasswordResetToken = function(){
    //create the reset token and save the encrypted one to the data base
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000
    return resetToken;
}



//DOCS MW

/** 
 * Middleware to hash the user's password before saving the document.
 * Runs only if the password was modified, before create/ update a user.
 */
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()

})


/** 
 * Middleware to set the passwordChangedAt field if the password was modified.
 * Ensures it is set before the token is issued.
 */
userSchema.pre('save', function(next){
    if(this.isNew || !this.isModified('password')) return next()

    this.passwordChangedAt = Date.now() -1000
    next()
})



const User = new mongoose.model('User', userSchema)

module.exports = User