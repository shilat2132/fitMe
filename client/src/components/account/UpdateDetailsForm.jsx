import { Form as FormRouter, useActionData, useRouteLoaderData, useSubmit } from "react-router-dom"
import styles from '../../styles/form.module.css'
import { Form } from "react-bootstrap"
import { lazy, useRef, useState } from "react"
import { generateActionMsg } from "../../utils/utils"


const PasswordInput = lazy(()=> import("../Auth/PasswordInput"))
const CustomModal = lazy(()=> import("../UI/CustomModal"))


/**
 * A form component for updating account's details
 *  - type = "updateDetails" or "updatePassword"
 */
const UpdateDetailsForm = ({type})=>{
    const [showModal, setShowModal] = useState(false)

    const isUpdateDetails = type === "updateDetails" //otherwise - updatePassword
    const {user} = useRouteLoaderData("root")


    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const currentPassword = useRef(null)

    const [showPassword, setShowPassword] = useState(false)
    const password = useRef(null)
    
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const passwordConfirm = useRef(null)

    const submit = useSubmit()
    const action = useActionData()
    const actionMsg = generateActionMsg(action)

    function deleteUserHandler(){
        setShowModal(false)
        submit({action: "deleteUser"} , {method: 'DELETE'}) 
    }
   
    let inputs

    if(isUpdateDetails){
        inputs = <>
        <Form.Group  className={`${styles.formGroup} ${styles.authFormGroup}`}>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control defaultValue={user.email} type="email" name="email" placeholder="Enter email" required />
        </Form.Group>

        <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
            <Form.Label htmlFor="name" >Name</Form.Label>
            <Form.Control type="text" name="name" defaultValue={user.name} placeholder="Enter name" required />
        </Form.Group>

        <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
            <Form.Label htmlFor="phone" >Phone</Form.Label>
            <Form.Control defaultValue={user.phone} type="phone" name="phone" placeholder="Enter phone" required />
        </Form.Group>
        </>
    }else{
        inputs = <>
             <PasswordInput ref={currentPassword} name="currentPassword"  
                show={showCurrentPassword} label="Current Password" setShow={setShowCurrentPassword} />

            <PasswordInput ref={password} name="password"  
                show={showPassword} setShow={setShowPassword} label="New Password" />
            
            <PasswordInput ref={passwordConfirm} name="passwordConfirm"  
            show={showPasswordConfirm} label="Confirm New Password" setShow={setShowPasswordConfirm} />      
   </>
    }


    return(
        <FormRouter className="container" method="PATCH">
            <div className={styles.inputsDiv}>
                <input readOnly defaultValue={type} hidden name="action"/>
                {inputs}
            </div>
            
            {actionMsg && actionMsg}
            {!isUpdateDetails && <p className="message">After updating the password you'll be logged out</p>}
            
           {isUpdateDetails && <>
            <button onClick={e => setShowModal(true)} 
                className={`${styles.button} ${styles.deleteButton}`} type="button"> Delete account</button>
            
            <CustomModal show={showModal} setShow={setShowModal} triggerHandler={deleteUserHandler} title="Delete User?"
            body= "Are you sure you want to delete your account? "  />
           </>
           
           }
                <button type="submit" id={!isUpdateDetails ? styles.passwordUpdateBtn : ""} className={styles.button}>Update</button>
        </FormRouter>
    )
}


export default UpdateDetailsForm