import { redirect } from "react-router-dom"


 async function logoutAction ({request, params}) {
    await fetch(`/api/user/logout`, { credentials: 'include' }) //removes the cookie
    return redirect("/auth/login")
}

export default logoutAction