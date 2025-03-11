export const vacationActions = async({request})=>{
    const formData = await request.formData()
    const method = request.method

    if(method === "DELETE"){
        const vacId = formData.get("vacId")

        const response = await fetch(`/api/trainer/vacations/${vacId}`, {
            method,
            credentials: 'include'
        })

        if(!response.ok){
            const responseData = await response.json()
            return {isCancel: true, error: responseData.message ? responseData.message : "Error"}
        }

        return {isCancel: true, message: "The vacation was canceled"}
    }

    if (method=== "POST"){
        
        let body = {
            from: formData.get("from"),
            to: formData.get("to")
        }

        const desc = formData.get("description")
        if (desc){
            body = {...body, description: desc}
        }

        const response = await fetch("/api/trainer/vacations", {
            method,
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
    
        const responseData = await response.json()
        if(!response.ok){
            
            return {error: responseData.message ? responseData.message : "Error"}
        }
    
        return {message: "The vacation request was sent successfully"}
    }
}