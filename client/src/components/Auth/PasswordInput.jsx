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
    const {name, show, setShow, error, label} = props

    function passwordsToggler (e){
        setShow(prev=> !prev)
        if (ref.current) {
          ref.current.focus();
        }
    }

    const isConfirm = name === "passwordConfirm"
    let placeholder;
    if (isConfirm){
      placeholder = label
    }else{
      placeholder = "Enter a " + label 
    }
    return (
      <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
        <Form.Label htmlFor={name}>{label}</Form.Label>
        <InputGroup>
          <Form.Control placeholder={placeholder}
            type = {show ? "text" : "password"}
            name={name} required
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