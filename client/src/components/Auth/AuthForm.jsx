import { Form as FormRouter, NavLink, useActionData, useNavigation } from "react-router";
import {Form} from 'react-bootstrap';


import styles from "../../styles/form.module.css"
import { useRef, useState } from "react";
import PasswordInput from "./PasswordInput";
import { generateActionMsg } from "../../utils/utils";


const AuthForm = ({type}) => {
  const [showPassword, setShowPassword] = useState(false)
  const password = useRef(null)

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const passwordConfirm = useRef(null)
  const error = useActionData()
  
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  


  const typeDict = {
    "signup": "Sign Up",
    "login": "Login",
    "forgotPassword": "Forgot Password",
    "resetPassword": "Reset Password"
  }

  const typeTitle = typeDict[type]
  const isForgotPassword = type === "forgotPassword"
  const isReset = type === "resetPassword"

  const actionMsg = generateActionMsg(error)
  

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
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" required />
      </Form.Group>

     
    </>
  );

  if(isReset){
    content = (<>
    <PasswordInput ref={password} name="password" error = {error} 
      show={showPassword} label = "Password" setShow={setShowPassword} />
    
    <PasswordInput ref={passwordConfirm} name="passwordConfirm" error = {error} 
      show={showPasswordConfirm} label="Confirm Password" setShow={setShowPasswordConfirm} />      
      
    </>)
  }

  if (!isForgotPassword && !isReset){
    content = (<>
      {content}
      <PasswordInput ref={password} name="password" error = {error} 
        show={showPassword} label = "Password" setShow={setShowPassword} />
    </>)
  }

  if (type == "signup") {
    content = (
      <>
        {content}
        <PasswordInput ref={passwordConfirm} name="passwordConfirm" error = {error} 
          show={showPasswordConfirm} label="Confirm Password" setShow={setShowPasswordConfirm} />    


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

      {actionMsg && actionMsg}

      <button disabled={isSubmitting} className={styles.button}>
        {!isSubmitting && (isForgotPassword || isReset  ? "Submit" : type)}
        {isSubmitting && "Submitting..."}
        
        </button>

      {type == "login" && <NavLink className="forgotPassLink" to="/auth/forgotPassword">Forgot the password?</NavLink>}
      {!isForgotPassword && !isReset ? additional : ""}
    </FormRouter>
  );
};

export default AuthForm;
