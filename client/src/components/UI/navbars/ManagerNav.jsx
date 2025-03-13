import { NavLink} from "react-router-dom"
import Nav from 'react-bootstrap/Nav';

export const ManagerNav = ()=>{


    return(
        <Nav variant="tabs" className="fixed-bottom">
            <Nav.Item className="disabled">
                <Nav.Link disabled className="nav-link">Manager's tools</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <NavLink className="nav-link accountNavLink" to="appointments">Appointments</NavLink>
            </Nav.Item>
        

            <Nav.Item>
                <NavLink className="nav-link accountNavLink" to="manager/users/trainees">Users</NavLink>
            </Nav.Item>

            <Nav.Item>
                <NavLink className="nav-link accountNavLink" to="manager/vacations/approved">Vacations</NavLink>
            </Nav.Item>

            <Nav.Item>
                <NavLink className="nav-link accountNavLink" to="manager/schedule">Schedule</NavLink>
            </Nav.Item>

            <Nav.Item>
                <NavLink className="nav-link accountNavLink" to="manager/workouts">Workouts</NavLink>
            </Nav.Item>
            

        </Nav>
    )
}