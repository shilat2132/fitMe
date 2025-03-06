import { forwardRef } from "react";
import {Form, InputGroup} from 'react-bootstrap';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

import styles from "../../styles/form.module.css"
  

/**
 * A component for passwordConfirm or a password
 *  - includes the eye icon and toggler for show/hide password
 */
  const PasswordInput = forwardRef((props, ref)=>{
    const {name, show, setShow, error} = props

    function passwordsToggler (e){
        setShow(prev=> !prev)
        if (ref.current) {
          ref.current.focus();
        }
    }

    const isConfirm = name === "passwordConfirm"
    return (
      <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
        <Form.Label>Password {isConfirm ? "confirm": ""}</Form.Label>
        <InputGroup>
          <Form.Control 
            type = {show ? "text" : "password"}
            name={name} placeholder={isConfirm ? "Confirm password" : "Enter a password"} required
            ref={ref}
            />
            <InputGroup.Text onClick={passwordsToggler}>
            {show ? <IoMdEyeOff /> : <IoEye />}
            </InputGroup.Text>
          </InputGroup>

          {!isConfirm && error && error.errors && error.errors.passwordLength && 
            <Form.Text className={styles.formErrorMessage}>{error.errors.passwordLength}</Form.Text>}
          
          {isConfirm && error && error.errors && error.errors.password && 
            <Form.Text className={styles.formErrorMessage}>{error.errors.password}</Form.Text> }
        
        
    </Form.Group>
    )
  })

  export default PasswordInput