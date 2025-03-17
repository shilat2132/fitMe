import { redirect } from "react-router-dom"


export const deleteUserAction = async ({request})=>{
    const formData = await request.formData()
    const id = formData.get("id")
    
    const response = await fetch(`/api/manager/users/${id}`, {
            method: "DELETE",
            credentials: 'include'
        })

        if (!response.ok){
            const responseData = await response.json()
            throw new Response( responseData.message || "Error", { status: 500 })
        }else{
            return redirect ("/manager/users/trainees")
        }
    
}

export const userToTrainerAction = async({params})=>{

    
    const response = await fetch(`/api/manager/users/${params.id}`, {
        method: "POST",
        credentials: 'include',
    })

    const responseData = await response.json()
    if(!response.ok){
        
        return {error: responseData.message ? responseData.message : "Error"}
    }

    return redirect("/manager/users/trainers")
}

export const workoutsTypesActions = async({request})=>{
    const formData = await request.formData()
    const scheduleId = formData.get("scheduleId")
    const method = request.method

    let workouts;

    if(method === "PUT"){
        workouts = formData.get("workouts")
        workouts = workouts.split(",")
    }else{
        workouts = formData.getAll("workouts")
    }
    const body = {workouts}

    const response = await fetch(`/api/manager/workoutsTypes/${scheduleId}`, {
        method,
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })

    const responseData = await response.json()
    if(!response.ok){
        
        return {error: responseData.message ? responseData.message : "Error"}
    }


    return {message: "workouts updated successfuly"}
}


export const updateVacationAction = async ({request})=>{

    const formData = await request.formData()

    const body = {status: formData.get("status")}
    const vacationId = formData.get("vacationId")

    const response = await fetch(`/api/manager/trainers/vacations/${vacationId}/update`, {
        method: "PUT",
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })

    const responseData = await response.json()
    if(!response.ok){
        
        return {error: responseData.message ? responseData.message : "Error"}
    }

    return {message: "Vacation status was successfuly updated"}
}

export const scheduleActions = async ({request})=>{

    const formData = await request.formData()

    const method = request.method

    if (method === "DELETE"){
        const response = await fetch("/api/schedule", {
            method,
            credentials: 'include'
        })
    
        
        if(!response.ok){
            const responseData = await response.json()
            return {error: responseData.message ? responseData.message : "Error"}
        }
    
        return redirect("/manager/schedule")
    
    }

    const body = {
        maxDaysForward: formData.get("maxDaysForward"),
        appointmentTime: {
            workoutPeriod: formData.get("appointmentTime.workoutPeriod"),
            unit: formData.get("appointmentTime.unit")
        }
    }

    const response = await fetch("/api/schedule", {
        method,
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })

    const responseData = await response.json()
    if(!response.ok){
        
        return {error: responseData.message ? responseData.message : "Error"}
    }

    return {message: "Schedule was successfuly updated"}
}



