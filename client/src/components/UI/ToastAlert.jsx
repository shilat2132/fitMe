import { useEffect, useState } from "react";
import Toast from 'react-bootstrap/Toast';


export default function ToastAlert({isLoggedIn, user, isManager}){
    const [data, setData] = useState(null)
    const [showScheduleAlert, setShowScheduleAlert] = useState(false)
    const [body, setBody] = useState("")

  useEffect(()=>{

    async function fetchSchedule() {
      try {
          const response = await fetch("/api/schedule/scheduleToUpdate");
          const resData = await response.json();
      
          if (!response.ok) {
            throw new Error(resData.message || "Something went wrong");
          }
      
          setData(resData)

        } catch (error) {
            setData({error: error instanceof Error ? error.message : String(error) || 'Unknown error'})
        }
    }


    if(isManager){
        fetchSchedule()
        return;
    }else{
        if(isLoggedIn){
            setData({user})
        } 
    }


  }, [])

 
  useEffect(() => {
    if (data && !data.error) {
        // for the trainer, show alert only if he doesn't have workouts types
        if(data.user){
            setBody("Please add workouts types to the schedule so that users can schedule appointments")
            setShowScheduleAlert(user.workouts?.length === 0)
        }else{
            // for the manager - show alert if f he hasn't set a schedule or workouts types yet, show a proper message
            if(data.hasSchedule){
                if(data.schedule.workouts.length === 0){
                   setBody("Please add workouts types to the schedule so that users can schedule appointments")
                }
            }else{
                 setBody("Please create the schedule")
            }
            setShowScheduleAlert(!data.hasSchedule || (data.hasSchedule && data.schedule.workouts.length === 0));
        }
    }
}, [data])

if (data?.error) {
    return <p className="errorPageMessage">{data.error}</p>;
}





  return (
    <>
       
             <Toast show={showScheduleAlert} onClose={e=> setShowScheduleAlert(false)} className="toast sticky-top">
                <Toast.Header>
                <strong className="me-auto">Schedule Alert</strong>
                </Toast.Header>
                <Toast.Body>{body} </Toast.Body>
           </Toast>
        
    </>
  )
}