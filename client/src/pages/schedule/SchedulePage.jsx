import { useLoaderData } from "react-router-dom";


export default function SchedulePage(){
    const data = useLoaderData()
    console.log(data)


    return (<div>
        <h1>This is The schedule page</h1>
    </div>)
}