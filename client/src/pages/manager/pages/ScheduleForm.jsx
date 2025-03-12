import { Form as FormRouter, useActionData, useLoaderData, useSubmit } from "react-router-dom";
import { Form, InputGroup } from "react-bootstrap";
import styles from "../../../styles/form.module.css"
import { generateActionMsg } from "../../../utils/utils";
import { useState } from "react";
import CustomModal from "../../../components/UI/CustomModal";


export default function ScheduleForm (){
    const [show, setShow] = useState(false)

    const action = useActionData()
    const actionMsg = generateActionMsg(action)

    const load = useLoaderData()

    let isCreate = true
    let method = "POST"
    let schedule

    if(load.hasSchedule){
        isCreate = false
        schedule = load.schedule
        method = "PATCH"
    }

    const submit = useSubmit()

    function deleteSchedule(){
        submit({}, {method: "DELETE"})
    }


    return (<>
    <h2> {isCreate ? "Create" : "Update"} Schedule </h2>
        <FormRouter  className="container" method={method}>
            {/* <input hidden readOnly value={isCreate} name="isCreate"/> */}
        <Form.Group className={`${styles.formGroup}`}>
            <Form.Label htmlFor="maxDaysForward">Advance booking window (in days)</Form.Label>
            <Form.Control className={styles.shortInput} defaultValue={isCreate ? 1 : schedule.maxDaysForward} min={1} max={60} type="number" name="maxDaysForward" required  />
        </Form.Group>

        <div className={styles.inlineInputs}>
            <Form.Group className={`${styles.formGroup}`}>
                <Form.Label htmlFor="appointmentTime.workoutPeriod">Workout Length (in days)</Form.Label>
                <Form.Control className={styles.shortInput} defaultValue={isCreate ? 1 : schedule.appointmentTime.workoutPeriod}  
                    type="number" name="appointmentTime.workoutPeriod"/>
            </Form.Group>

        <Form.Select className={`${styles.formGroup} ${styles.shortInput}`} name='appointmentTime.unit' defaultValue={isCreate ? "h" : schedule.appointmentTime.unit}>
            <option value="h">hour(s)</option>
            <option value="m">minutes</option>
        </Form.Select>
        </div>
        {actionMsg && actionMsg}
        {!isCreate && <>
            <button onClick={e=> setShow(true)} className={styles.deleteButton}>Delete Schedule</button>
            <CustomModal show={show} setShow={setShow} triggerHandler={deleteSchedule} 
                title= "Delete schedule?" body="Are you sure you want to delete the schedule"
            />
        </>}
        <button type="submit" className={styles.button}> {isCreate ? "Create" : "Update"} </button>
        </FormRouter>
    </>)
}