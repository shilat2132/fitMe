import { Form as FormRouter, NavLink, useActionData } from "react-router";
import {Form, InputGroup} from 'react-bootstrap';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

import styles from "../../styles/form.module.css"
import { useRef, useState } from "react";
import PasswordInput from "./PasswordInput";


const AuthForm = ({type}) => {
  const [showPassword, setShowPassword] = useState(false)
  const password = useRef(null)

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const passwordConfirm = useRef(null)
  const error = useActionData()


  const typeDict = {
    "signup": "Sign Up",
    "login": "Login",
    "forgotPassword": "Forgot Password",
    "resetPassword": "Reset Password"
  }

  const typeTitle = typeDict[type]
  const isForgotPassword = type === "forgotPassword"
  const isReset = type === "resetPassword"

  let additional = (<div style={{fontSize: "13px", fontWeight: "600"}}>
    Already have a user? <NavLink to="/auth/login">Login</NavLink>
    </div>)

  if (type == "login"){
    additional = (<div style={{fontSize: "13px", fontWeight: "600"}}>
      Don't have a user yet? <NavLink to="/auth/signup">Signup</NavLink>
    </div>)
  }


  let content = (
    <>
      <Form.Group  className={`${styles.formGroup} ${styles.authFormGroup}`}>
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" required />
      </Form.Group>

     
    </>
  );

  if(isReset){
    content = (<>
    <PasswordInput ref={password} name="password" error = {error} 
      show={showPassword} setShow={setShowPassword} />
    
    <PasswordInput ref={passwordConfirm} name="passwordConfirm" error = {error} 
      show={showPasswordConfirm} setShow={setShowPasswordConfirm} />      
      
    </>)
  }

  if (!isForgotPassword && !isReset){
    content = (<>
      {content}
      <PasswordInput ref={password} name="password" error = {error} 
        show={showPassword} setShow={setShowPassword} />
    </>)
  }

  if (type == "signup") {
    content = (
      <>
        {content}
        <PasswordInput ref={passwordConfirm} name="passwordConfirm" error = {error} 
          show={showPasswordConfirm} setShow={setShowPasswordConfirm} />    


        <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter name" required />
        </Form.Group>

        <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
          <Form.Label>Phone</Form.Label>
          <Form.Control type="phone" name="phone" placeholder="Enter phone" required />
          {error && error.errors && error.errors.phone && <Form.Text className={styles.formErrorMessage}>{error.errors.phone}</Form.Text>}
        </Form.Group>
      </>
    );
  }

  return (
    
    <FormRouter style={{textAlign: "left"}}  method={isReset ? "PATCH" : "POST"} className={`${styles.center} ${styles.form} ${styles.authForm} `}>
      
      <h2 style={{textAlign: "center"}}>{typeTitle}</h2>
            <div className={styles.inputsDivAuth}>
                {content}
            </div>

      
      {error && error.error && <><Form.Text className={styles.formErrorMessage}>{error.error}</Form.Text><br/></>}
      <button className={styles.button}>{isForgotPassword || isReset  ? "Submit" : type}</button>

      {type == "login" && <NavLink className="forgotPassLink" to="/auth/forgotPassword">Forgot the password?</NavLink>}
      {!isForgotPassword && !isReset ? additional : ""}
    </FormRouter>
  );
};

export default AuthForm;
