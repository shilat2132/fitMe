import { json } from "react-router-dom"


const generalLoader = async ({apiUrl})=>{
    try {
        
        const response = await fetch(apiUrl, { credentials: 'include' })
        const data = await response.json()
        if(!response.ok){
            throw json({message: JSON.stringify(data.error)}, {status: response.status})
        }
        return data
    } catch (error) {
        throw json({message: JSON.stringify(error.message)}, {status: 500})
    }
}

export default generalLoader