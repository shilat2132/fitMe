import { lazy, useState } from "react"
import { useActionData, useLoaderData, useSubmit } from "react-router-dom"
import styles from "../../../styles/form.module.css"
import { FaPlus } from "react-icons/fa";
import { generateActionMsg } from "../../../utils/utils"

const CustomModal = lazy(()=> import("../../../components/UI/CustomModal"))

const AllVacations = lazy(()=> import("../../../components/trainers/AllVacations"))
const VacationForm = lazy(()=> import("../../../components/trainers/VacationForm"))


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
               <button  className= {styles.button} onClick={e=> setShowVacationModal(true)}>
                    Add a Vacation <FaPlus />
               </button> 

            <CustomModal show={showVacationModal} setShow={setShowVacationModal} title="Add a vacation"
            body={<VacationForm/>} defaultBtns={false} />

           

        {!haveVacations && <p className="message">No vacations yet </p> }
        
        {haveVacations &&  <AllVacations vacations={vacations} from="trainer" />}

            {actionMsg && actionMsg}
                
           
    
    </>)
}