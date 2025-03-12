import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';



export default function VacationsNav(){

    return (<>
    
    <Nav variant="tabs" defaultActiveKey="approved" >
      
      <Nav.Item>
        <NavLink className="nav-link accountNavLink" to="approved" >Approved Vactions</NavLink>
      </Nav.Item>

      <Nav.Item>
        <NavLink className="nav-link accountNavLink" to="toApprove">Vacations to approve</NavLink>
      </Nav.Item>
    </Nav>

     
       
      
      
    </>
  
    )
}