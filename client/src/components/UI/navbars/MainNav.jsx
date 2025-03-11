import { NavLink, useSubmit } from "react-router-dom"
import styles from '../../../styles/navbar.module.css'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button';
import { CgProfile } from "react-icons/cg";

const MainNav = ({role, isLoggedIn})=>{
    const submit = useSubmit()
    async function logoutHandler(event){
        event.preventDefault()
        await submit(null, {action: "/auth/logout", method: "post"})
    }

    let a = <>
            <NavLink className={`${styles.navLink} nav-link`} to="/auth/signup">Sign up </NavLink>
            <NavLink className={`${styles.navLink} nav-link`} to="/auth/login">Log in</NavLink>
    </>

    if(isLoggedIn){
        a = <NavLink onClick={logoutHandler} to="/auth/logout" className={`${styles.navLink} nav-link`} >Log out</NavLink>
    }


    return (
        <Navbar bg="dark" data-bs-theme="dark" fixed="top" expand="lg" className={` ${styles.navbar}`}>
            <Navbar.Brand id={styles.navbarBrand} href="/">FitMe</Navbar.Brand>
            <Navbar.Toggle id={styles.navbarToggler} aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {isLoggedIn && <NavLink className={`${styles.navLink} nav-link`} to="/me"><CgProfile /></NavLink>}
                    
                    
                    {isLoggedIn && role==="trainee" && <NavLink className={`${styles.navLink} nav-link`} to="/appointments">My Appointments</NavLink>}
                    
                    {a}
                    </Nav>
            </Navbar.Collapse>
            <NavLink className={`${styles.navLink} nav-link`} to="/makeAnAppt"><Button variant="outline-light">Appointment+</Button>{' '}
                    </NavLink>
        </Navbar>
    )
}

export default MainNav