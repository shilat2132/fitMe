import { useSubmit } from "react-router-dom"
import styles from "../../styles/appts.module.css"
import { useState } from "react";
import { Modal } from "react-bootstrap";

export default function Appt({date, hour, workout, apptId}){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    const submit =  useSubmit()
    const d = new Date(date)
    function cancelApptClick(){
       setShow(true)
    }

    function cancelSubmit(){
        setShow(false)
        submit({apptId}, {method: "DELETE"})
    }

    return (
        <div className={`${styles.apptListItem}`}>
            <span className={styles.apptInfoSpan}>{`${d.toLocaleDateString()}, ${hour}`}</span>  
            <span className={styles.apptInfoSpan}>{workout}</span>  
            <button className={styles.button} onClick={cancelApptClick}>Cancel Appointment</button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Cancel appointment?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to cancel the appointment for {d.toLocaleDateString()} in {hour}, {workout}?</Modal.Body>
                <Modal.Footer>
                <button className="cancelBtn" onClick={handleClose}>
                    No
                </button>
                <button className="okBtn" onClick={cancelSubmit}>
                    Yes
                </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}