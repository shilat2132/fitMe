/**converts an hour in string formatted as hour:minutes to a double */
exports.stringHourToDouble = stringHour =>{
    
    const partsString = stringHour.split(':') //16:30 => ['16', '30']
    const partsInt = partsString.map(e => parseInt(e)) // [16, 30]
    partsInt[1] = partsInt[1]/60 //[16, 0.5]
    // return (partsInt[0] + partsInt[1]).toFixed(2) //16.5
    return (partsInt[0] + partsInt[1]) //16.5

}

/**gets an hour in double and converts it to a string formatted as hour:minutes */
exports.doubleHourToString = doubleHour =>{
    // 16.5 (num) => '16:30' 
    let integerPart = parseInt(doubleHour) //16
    
    let decimalPart = (doubleHour-integerPart)*60
    decimalPart= Math.round(decimalPart)

    if(integerPart<10){
        integerPart = "0"+integerPart
    }
    if(decimalPart<10){
        decimalPart= "0" +decimalPart 
    }
    return integerPart + ":" +decimalPart 
    //second part: 16.5-16 = 0.5, 0.5*60= 30 => "16:30"
}



