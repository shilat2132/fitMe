import { useState } from "react";
import { Form } from "react-bootstrap";
import { Form as FormRouter } from "react-router-dom";
import TrainerInputs from "./TrainerInputs";


export default function ApptForm({trainers, date}){
    const [inputs, setInputs] = useState(null)

    function onSelectTrainer(e){
        const val = e.target.value
        if (val == "default"){
            setInputs(null)
            return;
        }
        const trainer = trainers[val]
        console.log(trainer)
        setInputs(<TrainerInputs availableHours = {trainer.availableHours} workouts={trainer.workouts}/>)

    }

    return (
        <FormRouter method="POST">
            <input hidden readOnly value={date}/>
            <Form.Select name="trainer" onChange={onSelectTrainer} aria-label="Default select example">
                <option value="default">Select a trainer</option>
                {
                    Object.values(trainers).map(trainer=> (
                        <option key={trainer._id} value={trainer._id}>{`${trainer.name} - (${trainer.workouts.join(", ")})`}</option>
                    ))
                }
            </Form.Select>

            {inputs && inputs}
        </FormRouter>
    )
}