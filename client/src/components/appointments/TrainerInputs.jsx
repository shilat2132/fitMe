import { Form } from "react-bootstrap"
import styles from "../../styles/appts.module.css"

export default function TrainerInputs({availableHours, workouts}){

    return(<>
         <div className={styles.hours} >
            {availableHours.map(h=> (
                <div key={h} className={`form-group ${styles.hourItem} ${styles.inputOfHour}`}>
                    <input id={h} type="radio" name="hour" value={h}/>
                    <label htmlFor={h}>{h}</label>
               
                </div>
                
            ))}

        </div>

        <Form.Select name="workout">

            {
                workouts.map(w=>(
                    <option value={w}>{w}</option>
                ))
            }
        </Form.Select>
    </>)
}