import { redirect } from "react-router-dom";

/** the root loader, gets the user details if he's logged in */
export const rootLoader = async()=>{

  const response = await fetch("/api/user/me")
  const responseData = await response.json()

  if(!response.ok){
      return {user: null, isLoggedIn: false}
  }
  return {user: responseData.user, isLoggedIn: true}
}

/** a general loader for a get request */
const generalLoader = async ({ apiUrl, params }) => {
    try {
      const id = params.id
      
      if (id){
        apiUrl += `/${id}`
      }
      const response = await fetch(apiUrl, { credentials: 'include' });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      return data;
    } catch (error) {
      throw new Response(
        JSON.stringify({ 
            message: error instanceof Error ? error.message : String(error) || 'Unknown error' 
        }),
        { status: 500 }
    );
    }
  };
  
  export default generalLoader;



  /** a loader for protected routes. if the user isn't logged in, it redirects it to the login page */
export async function protectedRouteLoader ({context}){
  const isLoggedIn = context.isLoggedIn
  if(!isLoggedIn){
    return redirect("/auth/login")
  }
}
  