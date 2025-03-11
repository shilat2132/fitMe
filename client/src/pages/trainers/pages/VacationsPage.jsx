import { useState } from "react"
import { ListGroup } from "react-bootstrap"
import { useActionData, useLoaderData, useSubmit } from "react-router-dom"
import CustomModal from "../../../components/UI/CustomModal"
import { VacationForm } from "../../../components/trainers/VacationForm"
import styles from "../../../styles/form.module.css"
import { FaPlus } from "react-icons/fa";



export default function VacationsPage(){
    const {docs: vacations, amount} = useLoaderData()
    const haveVacations = amount >0
    const [showVacationModal, setShowVacationModal]= useState(false)

    const submit = useSubmit()
    const action = useActionData()

    let actionMsg
    if(action){
        if(action.isCancel){
            if(action.error){
                actionMsg = <p className="errorMessage">{action.error} </p>
            }else if(action.message){
                actionMsg = <p className="message">{action.message} </p>
            }
        }
    }

    function cancelVacation(vacId){
        submit({vacId}, {method: "DELETE"})
    }
    return (<>
        <h5>Vacations</h5>
        <div className="text-center">
               <button  className= {styles.button} onClick={e=> setShowVacationModal(true)}>
                    Add a Vacation <FaPlus />
               </button> 
            </div>

            <CustomModal show={showVacationModal} setShow={setShowVacationModal} title="Add a vacation"
            body={<VacationForm/>} defaultBtns={false} />

           

        {!haveVacations && <p className="message">No vacations yet </p> }
        
        {haveVacations &&  <ListGroup className="container">
            {vacations.map(vac =>{
                    
                    let vacationStr = {from: new Date(vac.from).toLocaleDateString(), to: new Date(vac.to).toLocaleDateString()}
                    return (<ListGroup.Item className="vacationListItem" key={vac._id}>
                            <div className="ms-2 ">
                                <div style={{marginBottom: "9%"}} className="fw-bold">{vac.description}</div>
                                <span className="dateListItem"> {`${vacationStr.from} - ${vacationStr.to}`}</span>
                                <br/>
                                <span className="dateListItem">status: {vac.status}</span>
                            </div>
                            
                            <button onClick={e=> cancelVacation(vac._id)} className={styles.cancelVacationBtn}>Cancel Vacation </button>
                        </ListGroup.Item>)
                    })}
                    {actionMsg && actionMsg}
            </ListGroup>}
                
           
    
    </>)
}