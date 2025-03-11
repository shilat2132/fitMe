import  {Outlet, useLoaderData} from "react-router-dom"
import MainNav from "./navbars/MainNav";
import { TrainerNav } from "./navbars/TrainerNav";


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
                        </div> 
        </main>
      </div>
    );
  }
  


  