export const makeAnApptAction = async({request, params})=>{
    const formInputs = await request.formData()

    const appt = {
        date: formInputs.get("date"),
        trainer: formInputs.get("trainer"),
        workout: formInputs.get("workout"),
        hour: formInputs.get("hour")
    }

    const response = await fetch("/api/user/makeAnAppt", {
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