import { lazy } from "react"
import { Outlet } from "react-router-dom"

const AccountNav = lazy(()=> import("../navbars/AccountNav"))

const AccountLayout = ()=>{
    return (
        <div className="accountLayout">
            <div className="accountLayer navLayer">
                <AccountNav/>
            </div>
           <div className="accountLayer contentLayer container">
           <Outlet/>
           </div>

          
        </div>
    )
}

export default AccountLayout