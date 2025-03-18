import { useActionData, useLoaderData, useNavigate, useSearchParams } from "react-router-dom"
import styles from '../../styles/appts.module.css'
import formStyles from "../../styles/form.module.css"
import { Form, InputGroup } from "react-bootstrap"
import { FaSearch } from "react-icons/fa";
import { lazy } from "react";


const AllAppts = lazy(()=> import("../../components/appointments/AllAppts"))


const ApptsPage = ()=>{
    

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
                            <FaSearch onClick={filterDateHandler} className="adjacentIcon" />
                        </InputGroup>
                        
                    </Form.Group>
                 </form>
             
             {haveAppts && 
             <div>
                {actionMessage && <span>{actionMessage}</span>}
                
                <AllAppts appts={appts}/>
            </div>
            }
            {!haveAppts && <p className="message">No Appointment was scheduled yet</p>}
           
        </div>
    )
}

export default ApptsPage