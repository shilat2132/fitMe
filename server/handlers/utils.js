const Appt = require("../models/time/Appointment")
const Trainer = require("../models/users/Trainer")

/**
 * a function for checking whether an appointment for a given trainer is available 
 * - meanning it's not scheduled and not in a day of the trainer's vacation or rest day
* @param dateStr - the string date of the appointment to check
* @param hour - string hour of the appintment we want to check
* @param trainerId - the id of the trainer that we try to schedule to

*@returns true if appointment is free, else returns false. returns null if an error occur
*/
exports.isApptAvailable = async (dateStr, hour, trainerId)=>{
    try {
        // a query to find the trainer and make sure the given date is NOT in the range of ANY element of the vacations and not a rest day
        const dateObj = new Date(dateStr)
        const weekDay = dateObj.getDay()
        const query ={
            _id: trainerId,
            restingDay: {$ne: weekDay},
        }
        const trainer = await Trainer.findOne(query).populate("vacations").lean()
        
        if (!trainer){
            return false
        }

        const isOnVacation = trainer.vacations.some(vacation =>
            dateObj >= vacation.from && dateObj <= vacation.to
        )

        if (isOnVacation){
            return false
        }
        const appt = await Appt.findOne({date: dateStr, trainer: trainerId, hour: hour}).select("_id").lean()
        return !appt
    } catch (error) {
        console.log("An error occured in isApptAvailable function  ", error)
        return null
    }
}



/**
     * @param obj - the current object to filter
     * @param allowedFields - the fields that can remain in the object
     * @returns the object containing only the allowed fields
     */
exports.filterBody = (obj, ...allowedFields) =>{
    
    const newObj = {}
    // goes over the obj's fields and only if it's part of the allowed fields, adds it to the new object
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)){
            newObj[el] = obj[el]
        }
    })
    return newObj
}


