import { useActionData, useLoaderData, useNavigate, useSearchParams } from "react-router-dom"
// import { Appt } from "./Appt"
import styles from '../../styles/appts.module.css'
import formStyles from "../../styles/form.module.css"
import Appt from "../../components/appointments/Appt"
import { Form, InputGroup } from "react-bootstrap"
import { FaSearch } from "react-icons/fa";

// import formStyles from '../styles/form.module.css'
// import { isLoggedIn } from "../utils/auth"

const ApptsPage = ()=>{
    

    // const fromTrainer = from==="admin"
    const {appts, amount } = useLoaderData()
    const haveAppts = amount >0
    const action = useActionData()
    const navigate = useNavigate()
    const [searchParams]= useSearchParams()
   const date = searchParams.get("date")

    let actionMessage;
    if(action){
        if(action.error){
            actionMessage =  <p className="errorMessage">{action.error}</p>
        }else if(action.success){
            actionMessage =  <p className="message">{action.success}</p>
        }
    }


    function filterDateHandler(){
        let date = document.getElementById("dateInput")
        date = date.value
        
        if (date){
            const url = `/appointments?date=${date}`
            navigate(url)
        }
    }


    return (
        <div className="container">
             <form>
                    <Form.Group className={`${formStyles.formGroup}`}>
                        <Form.Label htmlFor="date">Filter by date</Form.Label>
                        <InputGroup className= {styles.dateInputGroup}>
                            <Form.Control defaultValue={date || null} min={new Date()} id="dateInput" type="date" name="date"  />
                            <FaSearch onClick={filterDateHandler} style={{height: "auto"}} />
                        </InputGroup>
                        
                    </Form.Group>
                 </form>
             
             {haveAppts && 
                <div className={`${styles.apptsList} row`}>
                {actionMessage && <span>{actionMessage}</span>}
                {haveAppts && appts.map(appt=>(
                    <Appt className="col-lg-4 col-xs-6 col-sm-6" key={appt._id} 
                    date={appt.date} hour={appt.hour} workout={appt.workout} trainer={appt.trainer.name} trainee={appt.trainee.name}
                    apptId={appt._id} />
                ))}
            </div>
            }
            {!haveAppts && <p className="message">No Appointment was scheduled yet</p>}
           
        </div>
    )
}

export default ApptsPage