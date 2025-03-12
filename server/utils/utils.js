
 exports.clearTime = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 2);
    return d;
}

/**gets a date and returns its start and end of day objects */
exports.startEndDay = d =>{
    let date = new Date(d)
    date = this.clearTime(date)

    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    
    return {start, end}
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

const isToday= (date)=> {
    const today = new Date()
    date.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
  
    return date.getTime() === today.getTime()
  }

/**
 * 
 * @param {string} time gets the string time formatted as hh:mm or h:mm
 * @returns the amount of minutes in this time as a int
 */
const strHourToMinutesInt = (time)=>{
    // given time = 18:04
    
    let [h, m] = time.split(":") // ["18", "04"]
    // h = 18, m = 4
    h = parseInt(h)
    m = parseInt(m)

    const minutesTime = h*60 +m
    return minutesTime
}


/** checks whether a given start (string hour) is before a given end (string hour) */
exports.startBeforeEnd = (start, end)=>{
    const sMinutes = strHourToMinutesInt(start)
    const eMinutes = strHourToMinutesInt(end)
    return sMinutes < eMinutes
}
    
/**
 * 
 * @param {int} minutes
 * @returns the string representaion of the time of those minutes
 */
function minutesToStrTime(minutes){
    // minutes = 1084
    let h = Math.floor(minutes/60) //h=18
    let m = minutes%60 //m=4

    if (m< 10){
        m = "0" + m
    }
    return [h, m].join(":")

}


/** 
 * @returns an array of the string hours from the start to the end according to the wourkout period and unit
 */
exports.getHoursArr = (start, end, workoutPeriod, unit, date) =>{
    if (unit!= 'h' && unit!="m"){
        throw TypeError("The unit should be either 'h' or 'm'")
    }

   
    
    const endMinutes = strHourToMinutesInt(end)
    const periodMinutes = unit== "h" ? workoutPeriod*60 : workoutPeriod
    let currentHourMinutes = strHourToMinutesInt(start)
    const hours = []


    // if the given date is today, insert only hours that are later than now
    const isTodayVar = isToday(date)
   

    if (isTodayVar){
        const now = new Date()

        const hour = now.getHours()
        const minutes = now.getMinutes()

        const totalMinutes = strHourToMinutesInt([hour, minutes].join(":"))

        while (currentHourMinutes + periodMinutes <= endMinutes){
            if(totalMinutes < currentHourMinutes){
                hours.push(minutesToStrTime(currentHourMinutes))
            }
            currentHourMinutes += periodMinutes
        }
        return hours
    }

    while (currentHourMinutes + periodMinutes <= endMinutes){
        hours.push(minutesToStrTime(currentHourMinutes))
        currentHourMinutes += periodMinutes
    }

    return hours

}


exports.daysDifference = (day1, day2)=> {
    if ((!day1 instanceof Date) || (!day2 instanceof Date) ){
        throw TypeError("One of the parameters aren't instance of Date in the function daysDifference")
    }

    const diffInMs = day1.getTime() - day2.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return Math.round(diffInDays)
}

