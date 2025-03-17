import { useNavigation, useRouteLoaderData, useSubmit } from "react-router-dom"
import styles from "../../styles/appts.module.css"
import { useState } from "react";
import CustomModal from "../UI/CustomModal";

export default function Appt({date, hour, workout, apptId, trainer, trainee}){
    const [show, setShow] = useState(false);
    const {user} = useRouteLoaderData("root")
    const role = user.role
    
    const isTrainer = role === "trainer"
    const isManager = role ==="manager"

    const submit =  useSubmit()
    const d = new Date(date)

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting"

    function modalClick(){
       setShow(true)
    }

    function cancelSubmit(){
        setShow(false)
        submit({apptId}, {method: "DELETE", action: "/appointments"})
    }

    const modalBody = `Are you sure you want to cancel the appointment for ${d.toLocaleDateString()} in ${hour}, ${workout}?`

    return (
        <div className={`${styles.apptListItem}`}>
            <span className={styles.apptTime}>{`${d.toLocaleDateString()}, ${hour}`}</span>  
            <span className={styles.apptInfoSpan}>{isTrainer ?  trainee : trainer } -  {workout}</span>  

           {isManager && <span className={styles.apptTrainee}>{ trainee }</span>}
            <button style={{marginTop: "9%"}} disabled={isSubmitting} className={styles.button} onClick={modalClick}>{isSubmitting ? "Canceling..." : "Cancel Appointment"} </button>

            <CustomModal show={show} setShow={setShow} triggerHandler={cancelSubmit} 
                body={modalBody} title="Cancel appointment?" />
    
        </div>
    )
}