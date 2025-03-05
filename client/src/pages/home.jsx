import { useOutletContext } from "react-router-dom"

export const Home = ()=>{
    const { isLoggedIn, user } = useOutletContext()
    return (
        <div>
            <h1>Hello {isLoggedIn ? user.name : "stranger"}</h1>
        </div>
    )
}