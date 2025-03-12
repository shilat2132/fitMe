import { Form as FormRouter, useActionData, useLoaderData, useOutletContext } from "react-router-dom"
import styles from "../../styles/form.module.css"
import { Form, InputGroup } from "react-bootstrap"
import { generateActionMsg } from "../../utils/utils"


const WorkDetailsForm = ()=>{
    const action = useActionData()
    const actionMsg = generateActionMsg(action)

    const {schedule} = useLoaderData()
    const allowedWorkouts = schedule.workouts 

    const {user} = useOutletContext()
    const currentTrainerWorkouts = user.workouts

    const daysOfWeek = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }
    
    

    return(
        <FormRouter className="container" method="PUT">
            <div >
                <InputGroup >
                    <Form.Group style={{marginLeft: "0px"}} className={`${styles.formGroup} `}>
                        <Form.Label htmlFor="workingHours[start]">Start hour of the day</Form.Label>
                        <Form.Control defaultValue={user.workingHours.start} type="time" name="workingHours[start]" />
                    </Form.Group>
                    
                    <Form.Group className={`${styles.formGroup} `}>
                        <Form.Label htmlFor="workingHours[end]">End hour of the day</Form.Label>
                        <Form.Control defaultValue={user.workingHours.end} type="time" name="workingHours[end]" />
                    </Form.Group>
                    
                </InputGroup>

                <Form.Label htmlFor="restingDay"> Resting Day</Form.Label>
                <Form.Select className={`${styles.restingDay}`} defaultValue={user.restingDay} name="restingDay">
                    {
                        Object.entries(daysOfWeek).map(([k, v])=> (
                            <option  key={k} value={k}>{v}</option>
                        ))
                    }
                </Form.Select>
                

                <Form.Group className={`${styles.formGroup}`}>
                    <Form.Label htmlFor="workouts">Workouts</Form.Label>
                    {allowedWorkouts.map(w=> (
                        <Form.Check
                        key={w}
                        inline
                        defaultChecked = {currentTrainerWorkouts.includes(w)}
                        label={w}
                        value={w}
                        name="workouts"
                        type= "checkbox"
                        
                    />
                    ))}
                    
                </Form.Group>
            
            </div>
            
            {actionMsg && actionMsg}
            
           
           
           
                <button type="submit" className={styles.button}>Update</button>
        </FormRouter>
    )
}


export default WorkDetailsForm