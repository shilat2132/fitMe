import { lazy } from "react"

const AuthForm = lazy(()=> import("../../../components/Auth/AuthForm"))


const ResetPassPage = ()=>{
    
    return (<AuthForm type="resetPassword" />)
}

export default ResetPassPage