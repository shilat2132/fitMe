import  {Outlet, useLoaderData} from "react-router-dom"
import MainNav from "../navbars/MainNav";
import { TrainerNav } from "../navbars/TrainerNav";
import { ManagerNav } from "../navbars/ManagerNav";


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
          <Outlet context={{ isLoggedIn, user }} />

          <div className="accountLayer">
            {isLoggedIn && role === "trainer" &&  <TrainerNav/>}
            {isLoggedIn && role === "manager" &&  <ManagerNav/>}
                        </div> 
        </main>
      </div>
    );
  }
  


  