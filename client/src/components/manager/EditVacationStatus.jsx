import { Form, InputGroup} from 'react-bootstrap';
import styles from "../../styles/form.module.css"
import { Form as FormRouter} from "react-router-dom"

function EditVacationStatus({vacation}) {
  return (
    <FormRouter method='PUT'>
        <InputGroup>
        <Form.Select name='status' defaultValue={vacation.status}>
            <option value="approved">approved</option>
            <option value="not approved">not approved</option>
            <option value="Under review">Under review</option>
        </Form.Select>
        <input hidden name='vacationId' readOnly value={vacation._id}/>
    <button className={styles.editVacationBtn} type='submit'>Change</button>
        </InputGroup>
        
    </FormRouter>
  );
}

export default EditVacationStatus;