import { Outlet } from "react-router-dom"
import ManagerUsersNav from "../navbars/ManagerUsersNav"


const ManagerUsersLayout = ()=>{
    return (
        <div className="accountLayout">
            <div className="accountLayer navLayer">
                <ManagerUsersNav/>
            </div>
           <div className="accountLayer contentLayer container">
           <Outlet/>
           </div>

          
        </div>
    )
}

export default ManagerUsersLayout