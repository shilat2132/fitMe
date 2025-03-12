import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';



export default function AccountNav(){

    return (<>
    
    <Nav variant="tabs" defaultActiveKey="updateMe" >
      <Nav.Item>
        <NavLink className="nav-link accountNavLink" to="updateMe">Personal Info</NavLink>
      </Nav.Item>
      <Nav.Item>
        <NavLink className="nav-link accountNavLink" to="updatePassword" >Password Updating</NavLink>
      </Nav.Item>
    </Nav>

     
       
      
      
    </>
  
    )
}