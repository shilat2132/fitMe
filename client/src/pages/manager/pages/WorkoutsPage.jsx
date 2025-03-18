import { Form as FormRouter, useActionData, useLoaderData, useSubmit } from "react-router-dom";
import { Form, Stack } from "react-bootstrap";
import styles from "../../../styles/workoutsTypes.module.css"
import { generateActionMsg } from "../../../utils/utils";
import { lazy, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";


const WorkoutForm = lazy(()=> import("../../../components/manager/WorkoutForm"))
const CustomModal = lazy(()=> import("../../../components/UI/CustomModal"))

export default function WorkoutsPage (){
    const [show, setShow] = useState(false)

    const [inputsState, setInputsState] = useState("read")
    
    const action = useActionData()
    const actionMsg = generateActionMsg(action)

    const {workouts: schedule} = useLoaderData()
    const haveWorkouts = schedule.workouts.length >0

    const isRead = inputsState ==="read"

    const submit = useSubmit()
    let i=0;
    
    function deleteSchedule(){
        submit({}, {method: "DELETE"})
    }

    function toggleInputsState(){
        setInputsState(prev=>{
            if(prev==="read") return "delete"
            else return "read"
        })
    }

    const btnContent = isRead ? "Select workouts" : "Back to all workouts"


    return (<div className="container">
        {!haveWorkouts && <p className="message">You haven't added workouts types yet </p>}
        {actionMsg && actionMsg}

        <button className= {styles.toggleDeleteWorkoutsBtn} onClick={toggleInputsState}>
            {isRead && <FaMinus className={styles.icon} />} {btnContent}  
        </button>

        {isRead && <button onClick={e => setShow(true)} className="generalBtn">
        <FaPlus className={styles.icon} />  Add a workout  
        </button>}

        <CustomModal setShow={setShow} show={show} title="Add a workout" body={ <WorkoutForm scheduleId={schedule._id} setShow={setShow} />} defaultBtns={false}/>


       
        

        {haveWorkouts &&  <Stack direction="horizontal" className={styles.stack} gap={3}>
                
        {isRead && schedule.workouts.map(w=> {
            i++;
            return( <div key={i} className={`${styles.stackItems} p-2`}>{w} </div>)
        })}

        {!isRead && <FormRouter method="DELETE" >
            <input hidden readOnly value={schedule._id} name="scheduleId"/>

            <div className={styles.inputs}>
                {schedule.workouts.map(w=>{
                    i++;
                    return(
                        <Form.Group className={styles.input} key={i}>
                        <Form.Check name="workouts" type= "checkbox" value={w} label={w} />
                        </Form.Group>
                    )
                })}

            </div>

            <button type="submit" className={styles.deleteBtn}>Delete the selectes workouts</button>
            </FormRouter>}
      
   
         </Stack>}
    </div>)
}