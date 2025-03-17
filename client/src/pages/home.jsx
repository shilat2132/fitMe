import { NavLink, useOutletContext } from "react-router-dom"
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const dict = {
    manager: [
        {name: "Appointments", link: "appointments"},
        {name: "Users", link: "manager/users/trainees"},
        {name: "Vacations", link: "manager/vacations/approved"},
        {name: "Schedule", link: "manager/schedule"},
        {name: "Workouts", link: "manager/workouts"}

    ] ,
    trainee: [{name: "Schedule a workout", link: "makeAnAppt" }],
    trainer: [
        {name: "Appointments", link: "appointments"},
        {name: "Work Details", link: "trainer/updateWorkDetails"},
        {name: "Vacations", link: "trainer/vacations"},
        
    ]

}

export const Home = ()=>{
    const { isLoggedIn, user } = useOutletContext()

    let additional
    if(user){
        additional = dict[user.role]
    }else{
        additional = dict["trainee"]
    }

    return (
        <div>
            <h1>Hello {isLoggedIn ? user.name : "stranger"}</h1>
           

            <ButtonGroup vertical className="buttonGroup">
                {additional && additional.map(btn=> (
                    <Button key={btn.name} className="homeLinksBtn"><NavLink className="nav-link" to={btn.link}>{btn.name}</NavLink> </Button>
                ))}
            </ButtonGroup>
            
        </div>
    )
}