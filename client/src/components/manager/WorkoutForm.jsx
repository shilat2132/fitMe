import { Form as FormRouter, useActionData, useLoaderData, useSubmit } from "react-router-dom";
import { Form, InputGroup } from "react-bootstrap";
import styles from "../../styles/form.module.css"
import workoutsStyles from "../../styles/workoutsTypes.module.css"

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";


export default function WorkoutForm ({scheduleId, setShow}){
    const [workouts, setWorkouts] = useState([])
    const [msg, setMsg] = useState(null)

    const submit = useSubmit()

    let i =-1
    function addWorkout(){
        const w = document.getElementById("workout")
        setWorkouts(prev=> [...prev, w.value])
        
    }

    function deleteWorkout(i){
        setWorkouts((prev) => [
            ...prev.slice(0, i), 
            ...prev.slice(i + 1)
          ])
          

    }

    function submitWorkouts(e){
        e.preventDefault()
        if(workouts.length == 0){
            setMsg("You have to add at least one workout. Please notice that you have to enter '+' after inserting a workout input")
            return;
        }

        setMsg(null)
        setShow(false)
        submit({workouts, scheduleId }, {method: "PUT"})
    }


    return (<div className="container">
        
        <form onSubmit={submitWorkouts} method="PUT">
            {workouts.map(w=>{
                i++;
                return (
                    <div key={i}>
                        <TiDeleteOutline onClick={e=> deleteWorkout(i)} className="adjacentIcon" />
                        <span className={` ${workoutsStyles.workoutsBadges}`}  >{w} </span>
                    </div>
                )
            })}
            <br/>
            <Form.Label htmlFor="workout">Type a workout to add</Form.Label>
            <InputGroup>
                
                <Form.Control id="workout" type="text" name="workout"/>

                <FaPlus onClick={addWorkout} className="adjacentIcon"/>
            </InputGroup>

            {msg && <p className="errorMessage">{msg} </p>}
            <button className={styles.purpleBtn} type="submit">Finish & Update</button>
        </form>


        
     
    </div>)
}