import  {Outlet, useLoaderData} from "react-router-dom"
import MainNav from "./MainNav";


export default function Layout() {
  const { isLoggedIn, user } = useLoaderData()
    return (
      <div>
        <MainNav isLoggedIn={isLoggedIn}/>
        <main className="mainBody">
          <Outlet context={{ isLoggedIn, user }} />
        </main>
      </div>
    );
  }
  


  