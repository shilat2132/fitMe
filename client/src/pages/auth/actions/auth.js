import { redirect } from "react-router-dom"





/** action for : signup, login, forgotPassword, resetPassword */
const authAction = async({request, params})=>{
    
    const type = params.type ? params.type : "resetPassword"
    let url = `/api/user/${type}`
   
    const data = await request.formData()
    const errors={}

    let method = "POST"
    const isForgotPassword = type === "forgotPassword"
    const isReset = type === "resetPassword"
    
    let userInput
    
    if (isReset){
        userInput = {
            password: data.get("password"),
            passwordConfirm: data.get("passwordConfirm")
        }
        url = url + `/${params.token}`
        method = "PATCH"

        if(userInput.password !== userInput.passwordConfirm){
            errors.password = "The passwords are different"
        }

        if(userInput.password.length <8){
            errors.passwordLength = "A password must contain at least 8 characters"
        }
    }

    // signup, login and forgetPassword all need email
    if(!isReset){
        userInput= {email: data.get("email")}
    }


    // for login and signup - add the password input
    if (!isForgotPassword && !isReset){
        userInput = {
            ...userInput,
            password: data.get("password")
        }
    }
    if(type==='signup'){
         userInput = {
            ...userInput,
            name: data.get("name"),
            phone: data.get("phone"),
            passwordConfirm: data.get("passwordConfirm")
           }

        if(userInput.phone.length !==10){
            errors.phone = "Phone number must contain 10 digits"
        }
        if(userInput.password !== userInput.passwordConfirm){
            errors.password = "The passwords are different"
        }

        if(userInput.password.length <8){
            errors.passwordLength = "A password must contain at least 8 characters"
        }

        
    } 

    if(Object.keys(errors).length >0){
        return {errors: errors}
    }

    const response = await fetch(url, {
        method: method,
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

export default authAction