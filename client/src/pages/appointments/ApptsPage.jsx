import { useActionData, useLoaderData } from "react-router-dom"
// import { Appt } from "./Appt"
import styles from '../../styles/appts.module.css'
import Appt from "../../components/appointments/Appt"
// import formStyles from '../styles/form.module.css'
// import { isLoggedIn } from "../utils/auth"

const ApptsPage = ({from, name, userId})=>{
    // const fromAdmin = from==="admin"
    const {docs: appts, amount } = useLoaderData()
    const haveAppts = amount >0
    const action = useActionData()

    let actionMessage;
    if(action){
        if(action.error){
            actionMessage =  <p className="errorMessage">{action.error}</p>
        }else if(action.success){
            actionMessage =  <p className="message">{action.success}</p>
        }
    }
    return (
        <div className="container">
             {haveAppts && <div className={`${styles.apptsList} row`}>
                {actionMessage && <span>{actionMessage}</span>}
                {haveAppts && appts.map(appt=>(
                    <Appt className="col-lg-4 col-xs-6 col-sm-6" key={appt._id} 
                    date={appt.date} hour={appt.hour} workout={appt.workout} 
                    apptId={appt._id} />
                ))}
            </div>}
            {/* {!haveAppts && <p className="message">{fromAdmin ? "עוד לא נקבעו תורים" : "עוד לא קבעת תורים"}</p>} */}
           
        </div>
    )
}

export default ApptsPage