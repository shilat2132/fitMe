import { lazy, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Form as FormRouter, useActionData, useNavigation } from "react-router-dom";
import styles from "../../styles/appts.module.css"
import { generateActionMsg } from "../../utils/utils";

const TrainerInputs = lazy(()=> import("./TrainerInputs"))


export default function ApptForm({trainers, date}){
    if (Object.keys(trainers).length== 0){
        return (<p className={`${styles.apptForm} message container`}>
            No Trainers were found available for the required time
        </p>)
    }
    // const [inputs, setInputs] = useState(null)
    const [selectedTrainer, setSelectedTrainer] = useState("default")
    let action = useActionData()

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting"

    const [actionMsg, setActionMsg] = useState(null)

    useEffect(() => {
            const actionMsg = generateActionMsg(action)
            setActionMsg(actionMsg)
            

            const timer = setTimeout(() => {
                setActionMsg(null)
            }, 4000)

            return () => clearTimeout(timer)
        
    }, [action]); 



    useEffect(()=>{
        setSelectedTrainer("default")
    }, [date])


    function onSelectTrainer(e){
        const val = e.target.value
        setSelectedTrainer(val)

    }

    
    

    

    return (
        <FormRouter method="POST" className={`${styles.apptForm} container`}>
            {actionMsg }
            
            <input hidden readOnly value={date} name="date" />
            <label htmlFor="trainer">Trainer</label>
            <Form.Select value={selectedTrainer} id="trainer" name="trainer" onChange={onSelectTrainer} aria-label="Default select example">
                <option value="default">Select a trainer</option>
                {
                    Object.values(trainers).map(trainer=> (
                        <option key={trainer._id} value={trainer._id}>{`${trainer.name} - (${trainer.workouts.join(", ")})`}</option>
                    ))
                }
            </Form.Select>

            {(selectedTrainer !== "default") && <>
                <TrainerInputs availableHours={trainers[selectedTrainer].availableHours} 
                    workouts={trainers[selectedTrainer].workouts} />

                <button type="submit" disabled={isSubmitting} className={styles.submitBtn} >{isSubmitting ?  "Scheduling..." : "Schedule Appointment"}</button>
                
            </>
            
            }


        </FormRouter>
    )
}