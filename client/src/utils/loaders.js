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
const generalLoader = async ({ apiUrl }) => {
    try {
      const response = await fetch(apiUrl, { credentials: 'include' });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Response(
          JSON.stringify({ message: data.error || "Something went wrong" }),
          { status: response.status }
        );
      }
  
      return data;
    } catch (error) {
      throw new Response(
        JSON.stringify({ message: error.message || 'Unknown error' }),
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
  