import { Form as FormRouter } from "react-router";
import Form from 'react-bootstrap/Form';

import styles from "../styles/form.module.css"
const AuthForm = ({type}) => {
  const isLogin = type === "login";
  let content = (
    <>
      <Form.Group  className={`${styles.formGroup} ${styles.authFormGroup}`}>
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" required />
      </Form.Group>

      <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" placeholder="Enter password" required />
      </Form.Group>
    </>
  );

  if (!isLogin) {
    content = (
      <>
        {content}
        <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
          <Form.Label>Password Confirm</Form.Label>
          <Form.Control type="password" name="passwordConfirm" placeholder="Confirm password" required />
        </Form.Group>

        <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter name" required />
        </Form.Group>

        <Form.Group className={`${styles.formGroup} ${styles.authFormGroup}`}>
          <Form.Label>Phone</Form.Label>
          <Form.Control type="phone" name="phone" placeholder="Enter phone" required />
        </Form.Group>
      </>
    );
  }

  return (
    
    <FormRouter style={{textAlign: "left"}}  method="POST" className={`${styles.center} ${styles.form} ${styles.authForm} `}>
      <h2 style={{textAlign: "center"}}>{isLogin ? "Login" : "Signup"}</h2>
            <div className={styles.inputsDivAuth}>
                {content}
            </div>
      <button className={styles.button}>{isLogin ? "Login" : "Signup"}</button>
    </FormRouter>
  );
};

export default AuthForm;
