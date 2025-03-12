import styles from '../../../styles/managerUsers.module.css'
import { NavLink, useLoaderData } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';


function AllUsers({isTrainees}){
    const {docs: users, amount} = useLoaderData()

    let url = "/manager/users/"

    if (isTrainees){
        url += "trainees"
    }else{
        url += "trainers"
    }

    const haveUsers = amount>0
    return ( 
        <>
            {!haveUsers && <p className="container message">There are no users yet</p>}
            {haveUsers && 
                <ListGroup className='container' as="ol" numbered>
                    {users.map(user=> (
                        <ListGroup.Item key={user._id} as="li">
                            {user.name}
                            <NavLink className={styles.userNavLink} to={`${url}/${user._id}`}>User Details</NavLink>
                        </ListGroup.Item>
                    ))}
                
              </ListGroup>
            
            }
        </>
    )
}

export default AllUsers



