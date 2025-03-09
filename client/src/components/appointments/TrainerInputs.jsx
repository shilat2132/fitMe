import { Form } from "react-bootstrap"
import styles from "../../styles/appts.module.css"
import "../../styles/appts.css"


export default function TrainerInputs({availableHours, workouts}){

    return(<>
        <Form.Group>
            <label className={styles.workouts} htmlFor="workout">Workout</label>
            <Form.Select id="workout"  name="workout">

                    {
                        workouts.map(w=>(
                            <option key={w} value={w}>{w}</option>
                        ))
                    }
                </Form.Select>
        </Form.Group>

         <Form.Group className={styles.hours} >
         <label htmlFor="hour">Hour</label>
            {availableHours.map(h=> (
                <div key={h} className={`form-group ${styles.hourItem} ${styles.inputOfHour}`}>
                    <input id={h} type="radio" name="hour" value={h}/>
                    <label htmlFor={h}>{h}</label>
               
                </div>
                
            ))}

        </Form.Group>

       
    </>)
}