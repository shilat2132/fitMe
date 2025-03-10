import  {Outlet, useLoaderData} from "react-router-dom"
import MainNav from "./MainNav";


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
        </main>
      </div>
    );
  }
  


  