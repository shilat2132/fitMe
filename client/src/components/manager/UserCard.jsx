import { useActionData, useLoaderData, useSubmit } from "react-router-dom"
import Card from 'react-bootstrap/Card';
import AllAppts from "../appointments/AllAppts";
import CustomModal from "../UI/CustomModal";
import {  useState } from "react";
import AllVacations from "../trainers/AllVacations";
import styles from "../../styles/userCard.module.css"
import { generateActionMsg } from "../../utils/utils";

function UserCard(){
    const {user} = useLoaderData()
    const role = user.role
     const isTrainer = role === "trainer"

    const action = useActionData()
    const actionMsg = generateActionMsg(action)

   

    const [show, setShow] = useState(false)
    const submit = useSubmit()

    function deleteUser(){
        setShow(false)
        submit({id: user._id}, {method: "DELETE", action: "/manager/users"})
    }

    function userToTrainerButton(){
        submit({}, {method: "POST", action: `/manager/users/trainees/${user._id}`})
    }
    

    return(
        <div className="container">
            <Card style={{ width: '18rem', margin: "auto" }}>
                <Card.Body>
                <Card.Title>{user.name} </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{user.role}  </Card.Subtitle>
                <Card.Text>{user.phone} - {user.email} 
                    <br/>
                    {isTrainer && <span>
                        {user.workouts.map(w => ({w}))}
                        </span>}
                </Card.Text>

                
                <button className= {styles.deleteUserBtn} onClick={e => setShow(true)}>Delete User</button>
                <CustomModal show={show} setShow={setShow} triggerHandler={deleteUser}
                    title={`Delete ${user.name}?`}
                    body={`Are you sure you want to delete the account of ${user.name}?`}
                />

                {!isTrainer && <button onClick={userToTrainerButton} className={styles.button}>Turn user to Trainer</button>}
                {!isTrainer && actionMsg}
                </Card.Body>
            </Card>

           
           <div className={styles.moreInfo}>
           {user.vacations && user.vacations.length >0 && <AllVacations vacations={user.vacations} from="manager"/> }
           {user.appointments && user.appointments.length >0 && <AllAppts appts={user.appointments}/>}
           </div>
        </div>
    )
}


export default UserCard



