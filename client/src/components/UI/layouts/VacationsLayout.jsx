import { Outlet } from "react-router-dom"
import ManagerUsersNav from "../navbars/ManagerUsersNav"
import VacationsNav from "../navbars/VacationsNav"


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