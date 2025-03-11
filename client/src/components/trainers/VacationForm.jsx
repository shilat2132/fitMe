import { Form as FormRouter, useActionData } from "react-router-dom"
import styles from '../../styles/form.module.css'
import { Form } from "react-bootstrap";


export const VacationForm = ()=>{
    const action = useActionData()
    let actionMessage
    if (action){
        if(action.error){
            actionMessage = <p className="errorMessage">{action.error} </p>
        }else if(action.message){
            actionMessage = <p className="message">{action.message} </p>
        }
    }
    

    
     
    return (
        <FormRouter method="POST">
            <Form.Group className={`${styles.formGroup}`}>
                <Form.Label htmlFor="from">Starting date of the vacation</Form.Label>
                <Form.Control  type="date" name="from" required  />
            </Form.Group>

        
            <Form.Group className={`${styles.formGroup}`}>
                <Form.Label htmlFor="to">Ending date of the vacation</Form.Label>
                <Form.Control type="date" name="to" required />
            </Form.Group>


            <Form.Group className={`${styles.formGroup}`}>
                <Form.Label htmlFor="description">description</Form.Label>
                <Form.Control type="text" name="description"  />
            </Form.Group>

            {actionMessage && actionMessage}

            <button className={styles.button} type="submit">Submit</button>
        </FormRouter>
        // <Form onSubmit={onSubmitFetcher} id="modalForm">
        //     <DayPicker
        //         id="day"
        //         className="modalDayPicker"
        //         mode="range"
        //         selected={range}
        //         onSelect={setRange}
        //         modifiers={modifiers}
        //         locale={he}
        //         footer={footer}
        //     />

        //     <div className={styles.formGroup}>
        //         <label htmlFor="description">סוג חופשה</label>
        //         <input type="text" id="description" name="description"/>
        //     </div>
        //     {range && <input readOnly hidden value={JSON.stringify(range)} name="range" id="range"/>}
        //     {action && action.error && <p className={styles.formErrorMessage}>{action.error} </p>}
        //     {action && action.success && <p className={styles.formSuccessMsg}>{action.success} </p>}
        //     <div className="buttons">
        //         <button onClick={onClose} type="button">ביטול</button>
        //         <button type="submit" disabled={!range} className="button">הוספה</button>
        //     </div>
        // </Form>


    )
}


