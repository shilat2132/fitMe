import { lazy } from "react"
import { useParams } from "react-router-dom"

const AuthForm = lazy(()=> import("../../../components/Auth/AuthForm"))


const AuthPage = ()=>{
    const {type} = useParams()
    
    return (<AuthForm type={type} />)
}

export default AuthPage