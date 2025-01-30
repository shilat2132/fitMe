const mongoose = require('mongoose')
const Trainer = require('../users/Trainer')
const Schedule = require('./Schedule')
const Appointment = require("./Appointment")
const AppError = require("../../utils/AppError")
const {stringHourToDouble, doubleHourToString} = require("../../utils/helpingFunctions")
const { query } = require('../users/Vacation')


/**a schema for the day model
 * @property date - the date of that day.
 * @property schedule -  a reference field for the schedule model

 */
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

daySchema.index({date: 1})

// schema's methods
/**
 *  Retrieves a list of trainers who are working on the current day, along with their scheduled hours for the day.
 * 
 * @returns
 * - An array of trainer objects, each containing:
 *   - `_id`: Trainer's unique ID.
 *   - `name`: Trainer's name.
 *   - `workouts`: Array of workouts offered by the trainer.
 *   - `workingHours`: Trainer's working hours. object {start, end}, both are strings.
 *   - `scheduledHours`: Array of hours the trainer has appointments for that day.
 * - Returns `null` if no trainers are working on that day or an error occurs.
 * 
 * @throws {Error} Logs and returns `null` if an error occurs during the process.
 */
daySchema.methods.getWorkingTrainers = async function(){
    try {
        // get trainers that don't have a free day on that day, not in restingDay and not in a vacation
        const currentDayNum = this.date.getDay()
        const trainersQuery = {
            restingDay: {$ne: currentDayNum},
            $or: [
                {vacations: {$size: 0}},
                {
                    vacations: {
                        $not: {
                            $elemMatch: {
                                from: {$lte: this.date},
                                to: {$gte: this.date}
                            }
                        }
                    }
                }
            ]
        }
        const trainers = await Trainer.find(trainersQuery).select("_id name workouts workingHours").lean()
        if (!trainers || trainers.length ==0){
            return null
        }

        // retrives all the appointments for today
        const appts = await Appointment.find({date: this._id}).select("trainer hour").lean()
        
        // map each appointment to a trainer
        const trainersHoursDict = {}
       if (appts && appts.length > 0){
        let trainerId;
        appts.forEach(appt=>{
            trainerId = appt.trainer._id.toString()
            if (!trainersHoursDict[trainerId]) trainersHoursDict[trainerId] = []
            trainersHoursDict[trainerId].push(appt.hour)
        })
       }

        const finalTrainersArray = trainers.map(trainer=>(
            {
                ...trainer,
                scheduledHours: trainersHoursDict[trainer._id] || []
            }
        ))
        return finalTrainersArray
        
    } catch (error) {
        console.log("Error in the getWorkingTrainers of daySchema ", error)
        return null
    }
}




// daySchema.methods.getFreeApptsForCurrentDay = async function(){
//    try {
//      // Step 1: retrive the trainer that don't ave a free day in the current date
//      const dayNumber = this.date.getDay() //returns the number of the day between 0-6. sunday=0, monday= 1,...
    
    
//      const query = {
//          restingDay: {$ne: dayNumber}, 
//          $or: [
//              {vacations: {$size: 0}},
//              {
//                  vacations:{
//                      $not:{
//                          $elemMatch: {
//                              from: { $lte: this.date },
//                              to: { $gte: this.date }
//                          }
//                      }
//                  }
//              }
//          ]
//      }
//      let trainers = await Trainer.find(query)
//      if (!trainers){
//         return null
//      }
     
//      // Step 2: get all the appintments for the current date that belong to any of the trainers above
//         //group them by the trainer 
//      const trainerIds = trainers.map(trainer => trainer._id)
//      let appointmentsByTrainer = await Appointment.aggregate([
//              {
//                  // appointments that matches that condition
//                  $match:{
//                      date: this._id, 
//                      trainer: {$in: trainerIds}
//                  }
//              },
//              {
//                  $project:{
//                      trainer: 1,
//                      hour: 1
//                  }
//              },
//              {
//                  $group:{
//                      _id: "$trainer",
//                      apptsHours: { $push: "$hour"}
//                  }
//              },
//              {
//                  $addFields: {trainerId: '$_id'}
//              }
         
//          ])
   
//      appointmentsByTrainer = appointmentsByTrainer || []
//      const scheduleApptTime = await Schedule.findById(this.schedule).select('appointmentTime')
//      if (!scheduleApptTime){
//         throw new AppError("no schedule was found in daySchema methods", 404)
//      }
//      let {workoutPeriod, unit} = scheduleApptTime.appointmentTime
 
//      // if it's in hours then leave it that way, if it's minutes, convert it to hours
//      if (unit == "m"){
//          workoutPeriod = workoutPeriod/60
//      }
//      const apptsMap = new Map(appointmentsByTrainer.map(appt => [appt.trainerId.toString(), appt.apptsHours]));
 
//      const hoursArrayPerTrainer = trainers.map(trainer=>{
//          // an array for the appts for that trainer for current day
//          let trainerApptHours = apptsMap.get(trainer._id.toString()) || [];
//          trainerApptHours = new Set(trainerApptHours);
 
//          let {start, end} = trainer.workingHours
//          // Convert working hours to numeric format for easier calculations
//          start = stringHourToDouble(start);
//          end = stringHourToDouble(end);
     
//          // Generate free hours array per trainer
//          const freeHours = [];
//          for (let i = start; i <= end - workoutPeriod; i += workoutPeriod) {
//              const timeStr = doubleHourToString(i);
//              if (!trainerApptHours.has(timeStr)) {
//                  freeHours.push(timeStr);
//              }
//          }
         
//          return {
//              trainer: trainer.name,
//              workouts: trainer.workouts,
//              hours: freeHours
//          }
//      })
 
//      return hoursArrayPerTrainer
//    } catch (error) {
//     console.error("Error in getFreeApptsForCurrentDay:", error);
//     return null
//    }
// }

const Day = new mongoose.model('Day', daySchema)
module.exports = Day