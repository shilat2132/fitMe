import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';



export default function ManagerUsersNav(){

    return (<>
    
    <Nav variant="tabs" defaultActiveKey="trainees" >
      
      <Nav.Item>
        <NavLink className="nav-link accountNavLink" to="trainees" >Trainees</NavLink>
      </Nav.Item>

      <Nav.Item>
        <NavLink className="nav-link accountNavLink" to="trainers">Trainers</NavLink>
      </Nav.Item>
    </Nav>

     
       
      
      
    </>
  
    )
}