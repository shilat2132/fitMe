import { useRouteError } from "react-router-dom"
// import { MainNav } from "../UI/MainNav"
// import '../styles/general.css'

export const ErrorPage = ()=>{
    const error = useRouteError()
    console.log(error)
    let errorMessage;

    if(error.data){
        if(error.data.message){
            errorMessage = error.data.message
        }else{
            errorMessage = error.data
        }
    }else{
        errorMessage="something went wrong"
    }
    if (typeof errorMessage !== "string"){
        errorMessage="something went wrong"
    }
    return(
        <>
            {/* <MainNav/> */}
            <div className="errorMessage container">{errorMessage}</div>
        </>
        
    )
}