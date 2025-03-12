import { ListGroup } from "react-bootstrap"
import { useActionData, useSubmit } from "react-router-dom"
import styles from "../../styles/form.module.css"
import EditVacationStatus from "../manager/EditVacationStatus"
import { generateActionMsg } from "../../utils/utils"


export default function AllVacations({vacations, from}){
   const fromManager = from==="manager"
    const submit = useSubmit()

    const action = useActionData()
    const actionMsg = generateActionMsg(action)

    function cancelVacation(vacId){
        submit({vacId}, {method: "DELETE"})
    }

    return (
        <ListGroup className="container">
            {fromManager && actionMsg && actionMsg}
        {vacations.map(vac =>{
                
                const fromStr = new Date(vac.from).toISOString().split("T")[0]
                const toStr = new Date(vac.to).toISOString().split("T")[0]
                let vacationStr = {from: fromStr.replaceAll("-", "/") , to: toStr.replaceAll("-", "/") }
                return (<ListGroup.Item className="vacationListItem" key={vac._id}>
                        <div className="ms-2 ">
                            <div style={{marginBottom: "9%"}} className="fw-bold">  {`${vacationStr.from} - ${vacationStr.to}`}</div>
                            {fromManager && <>
                                <span className="dateListItem"> {vac.trainer.name}</span> <br/>
                            </>}
                            <span className="dateListItem"> {vac.description}</span>
                            <br/>
                             <span className="dateListItem"><b>status: </b> {vac.status}</span>
                        </div>
                        
                        {fromManager && <EditVacationStatus vacation={vac} /> }
                        
                        {!fromManager && <button onClick={e=> cancelVacation(vac._id)} className={styles.cancelVacationBtn}>Cancel Vacation </button>}
                    </ListGroup.Item>)
                })}
        </ListGroup>
    )
            
}