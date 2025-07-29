import styles from '../../../styles/managerUsers.module.css';
import { NavLink, useLoaderData } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

function AllUsers({ isTrainees }) {
    const { docs: users, amount } = useLoaderData();
    const urlPrefix = isTrainees ? "/manager/users/trainees" : "/manager/users/trainers";

    const haveUsers = amount > 0;

    return (
        <Container className="mt-4">
            {!haveUsers && <p className={styles.message}>There are no users yet</p>}
            {haveUsers &&
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {users.map(user => (
                        <Col key={user._id}>
                            <Card className={styles.userCard}>
                                <Card.Body>
                                    <Card.Title>{user.name}</Card.Title>
                                  
                                    <NavLink className={styles.userNavLink} to={`${urlPrefix}/${user._id}`}>
                                            View Details
                                    </NavLink>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            }
        </Container>
    );
}

export default AllUsers;
