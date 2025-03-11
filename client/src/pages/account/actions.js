import { redirect } from "react-router-dom"


const accountActions = async ({request, params})=>{
    const method = request.method //patch for updating password or details, delete for deleting user
    const formData = await request.formData()

    
    const action = formData.get("action")

    let apiUrl, body

    // delete user and update details have the same apiUrl
    if (action !== "updatePassword"){
        apiUrl = "/api/user/me"
    }
    if (action === "deleteUser"){
        const response = await fetch(apiUrl, {
            method,
            credentials: 'include'
        })

        if (!response.ok){
            return {error: "Error"}
        }else{
            return redirect ("/auth/signup")
        }
    }


    if (action === "updateDetails"){
        body = {
            email: formData.get("email"),
            phone: formData.get("phone"),
            name: formData.get("name")
        }
        
    }else{
        apiUrl = "/api/user/updatePassword"

        body = {
            currentPassword: formData.get("currentPassword"),
            password: formData.get("password"),
            passwordConfirm: formData.get("passwordConfirm")
        }
    }

    const response = await fetch(apiUrl, {
        method,
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })

   
    
    const responseData = await response.json()

    if(!response.ok){
        return {error: responseData.message ? responseData.message : "Error"}
    }

    if (action === "updatePassword"){
        return redirect("/auth/login")
    }

    return {message: "Your details were successfuly updated"}
    
}

export default accountActions