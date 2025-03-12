export const makeAnApptAction = async({request, params})=>{
    const formInputs = await request.formData()

    const appt = {
        date: formInputs.get("date"),
        trainer: formInputs.get("trainer"),
        workout: formInputs.get("workout"),
        hour: formInputs.get("hour")
    }

    const response = await fetch("/api/appointments/makeAnAppt", {
        method: "POST",
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(appt)
    })

    const responseData = await response.json()
    if(!response.ok){
        
        return {error: responseData.message ? responseData.message : "Error"}
    }

    return {message: "The appointment was successfully scheduled"}


}


export const cancelAppt = async ({request})=>{
    const formData = await request.formData(); 
    const apptId = formData.get("apptId"); 

    const response = await fetch(`/api/appointments/cancelAppt/${apptId}`, {
        method: "DELETE",
        credentials: 'include',
    })

    
    if(!response.ok){
        try {
            const responseData = await response.json()
            let error = "Error"
            if (responseData && responseData.message){
                error = responseData.message
            }
            return {error}
        } catch (error) {
            return {error: "Error"}
        }
        
    }

    const status = response.status.toString()

    if(status.startsWith("2")){
        return {success: "Appointment was successfuly deleted"}
    }

    return {error: "Error"}


}