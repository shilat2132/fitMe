
/** generates a message from the action data, either an error message or a regular one */
export const generateActionMsg = action =>{
    let actionMsg
    if(action){
        if(action.error){
            actionMsg = <p className= "errorMessage">{action.error}</p>
        }else if(action.message){
            actionMsg = <p className= "message">{action.message}</p>
        }
    }

    return actionMsg
}