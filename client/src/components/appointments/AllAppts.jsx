
import { lazy } from "react"
import styles from "../../styles/appts.module.css"

const Appt = lazy(()=> import("./Appt"))

export default function AllAppts({appts}){

    return (<div className={`${styles.apptsList} row`}>
    {appts.map(appt=>(
            <Appt className="col-lg-4 col-xs-6 col-sm-6" key={appt._id} date={appt.date} hour={appt.hour} 
            workout={appt.workout} trainer={appt.trainer.name} trainee={appt.trainee.name} apptId={appt._id} />
                        ))}
    </div>
        
    )
}