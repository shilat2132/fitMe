import { useState } from "react"
import { ListGroup } from "react-bootstrap"
import { useActionData, useLoaderData, useSubmit } from "react-router-dom"
import CustomModal from "../../../components/UI/CustomModal"
import { VacationForm } from "../../../components/trainers/VacationForm"
import styles from "../../../styles/form.module.css"
import { FaPlus } from "react-icons/fa";
import { generateActionMsg } from "../../../utils/utils"
import AllVacations from "../../../components/trainers/AllVacations"



export default function VacationsPage(){
    const {docs: vacations, amount} = useLoaderData()
    const haveVacations = amount >0
    const [showVacationModal, setShowVacationModal]= useState(false)

    const submit = useSubmit()
    const action = useActionData()

    let actionMsg
    if(action && action.isCancel){
        actionMsg = generateActionMsg(action)
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
        
        {haveVacations &&  <AllVacations vacations={vacations} from="trainer" />}

            {actionMsg && actionMsg}
                
           
    
    </>)
}