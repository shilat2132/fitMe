import { Outlet } from "react-router-dom"
import { lazy } from "react"

const VacationsNav = lazy(()=> import("../navbars/VacationsNav"))

const VacationsLayout = ()=>{
    return (
        <div className="accountLayout">
            <div className="accountLayer navLayer">
                <VacationsNav/>
            </div>
           <div className="accountLayer contentLayer container">
           <Outlet/>
           </div>

          
        </div>
    )
}

export default VacationsLayout