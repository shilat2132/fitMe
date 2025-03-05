import { useParams } from "react-router-dom"
import AuthForm from "../../components/AuthForm"



const AuthPage = ()=>{
    const {type} = useParams()
    
    return (<AuthForm type={type} />)
}

export default AuthPage