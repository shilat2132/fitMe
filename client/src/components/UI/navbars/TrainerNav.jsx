import { NavLink} from "react-router-dom"
import Nav from 'react-bootstrap/Nav';

export const TrainerNav = ()=>{


    return(
        <Nav variant="tabs" className="fixed-bottom">
            <Nav.Item className="disabled">
                <Nav.Link disabled className="nav-link">Trainer's tools</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <NavLink className="nav-link accountNavLink" to="appointments">Appointments</NavLink>
            </Nav.Item>
        

            <Nav.Item>
                <NavLink className="nav-link accountNavLink" to="admin/services">טיפולים</NavLink>
            </Nav.Item>

            <Nav.Item>
                <NavLink className="nav-link accountNavLink" to="trainer/vacations">Vacations</NavLink>
            </Nav.Item>
            

        </Nav>
    )
}