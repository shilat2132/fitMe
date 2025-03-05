import  {Outlet, useLoaderData} from "react-router-dom"


export default function Layout() {
  const { isLoggedIn, user } = useLoaderData()
    return (
      <div>
        <main>
          <Outlet context={{ isLoggedIn, user }} />
        </main>
      </div>
    );
  }
  


  