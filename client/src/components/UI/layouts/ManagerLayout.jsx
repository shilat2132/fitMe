import { Outlet } from "react-router-dom"
import { lazy } from "react"

const ManagerUsersNav = lazy(()=> import("../navbars/ManagerUsersNav"))


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