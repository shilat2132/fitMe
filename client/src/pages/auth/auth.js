import { redirect } from "react-router-dom"


export const rootLoader = async()=>{

    const response = await fetch("/api/user/me")
    const responseData = await response.json()

    if(!response.ok){
        return {user: null, isLoggedIn: false}
    }
    console.log (responseData)

    return {user: responseData.user, isLoggedIn: true}
}

export const authAction = async({request})=>{
    
    const url = request.url.split("/")
    const type = url[url.length -1]
    const data = await request.formData()
    const errors={}
    let userInput = {}

    if(type==='signup'){
         userInput = {
            name: data.get("name"),
            phone: data.get("phone"),
            email: data.get("email"),
            password: data.get("password"),
            passwordConfirm: data.get("passwordConfirm")
           }

        if(userInput.phone.length !==10){
            errors.phone = "מספר פלאפון צריך להכין 10 ספרות"
        }
        if(userInput.password !== userInput.passwordConfirm){
            errors.password = "הסיסמאות שהזנת שונות"
        }

        if(userInput.password.length <8){
            errors.passwordLength = "סיסמה אמורה להכיל לפחות 8 תווים"
        }

        if(Object.keys(errors).length >0){
            return {errors: errors}
        }
    } else if(type==="login"){
        userInput = {
            email: data.get("email"),
            password: data.get("password")
           }
    }
    const response = await fetch(`/api/user/${type}`, {
        method: "POST",
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userInput)
    })

    const responseData = await response.json()
    if(!response.ok){
        return {error: responseData.message ? responseData.message : "Error"}
    }

    // const tokenDate = new Date()
    // const days = parseInt(responseData.data.tokenExpiration)
    // tokenDate.setDate(tokenDate.getDate()+ days)
    // localStorage.setItem("tokenExpirationDate", tokenDate.toLocaleString())
    // localStorage.setItem("isLoggedIn", 1)
    // if(responseData.data.user.role){
    //     localStorage.setItem("role", responseData.data.user.role)
    // }
    // window.dispatchEvent(new Event('storage'))

    return redirect('/')
}