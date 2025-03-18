import  {Outlet, useLoaderData} from "react-router-dom"
import { lazy } from "react";

const TrainerNav = lazy(()=> import("../navbars/TrainerNav"))
const ManagerNav = lazy(()=> import("../navbars/ManagerNav"))
const MainNav = lazy(()=> import("../navbars/MainNav"))
const ToastAlert = lazy(()=> import("../../UI/ToastAlert"))


export default function Layout() {
  const { isLoggedIn, user } = useLoaderData()
  


  let role = ""
  if (user){
    role = user.role || ""
  }
    return (
      <div>
        <MainNav role ={role} isLoggedIn={isLoggedIn}/>
       
        <main className="mainBody">
        {role === "manager" && <ToastAlert isManager={true} isLoggedIn={isLoggedIn} user={user}  />}
        {role === "trainer" && <ToastAlert isManager={false} isLoggedIn={isLoggedIn} user={user}  />}

          <Outlet context={{ isLoggedIn, user }} />

          <div className="accountLayer">
            {isLoggedIn && role === "trainer" &&  <TrainerNav/>}
            {isLoggedIn && role === "manager" &&  <ManagerNav/>}
                        </div> 
        </main>
      </div>
    );
  }
  


  