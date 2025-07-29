import { NavLink, useOutletContext } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import styles from '../styles/Home.module.css';

const dict = {
  manager: [
    { name: "Appointments", link: "appointments" },
    { name: "Users", link: "manager/users/trainees" },
    { name: "Vacations", link: "manager/vacations/approved" },
    { name: "Schedule", link: "manager/schedule" },
    { name: "Workouts", link: "manager/workouts" }
  ],
  trainee: [
    { name: "Schedule a workout", link: "makeAnAppt" }
  ],
  trainer: [
    { name: "Appointments", link: "appointments" },
    { name: "Work Details", link: "trainer/updateWorkDetails" },
    { name: "Vacations", link: "trainer/vacations" }
  ],
  stranger: [
    { name: "Login", link: "auth/login" },
    { name: "Sign Up", link: "auth/signup" }
  ]
};

export const Home = () => {
  const { isLoggedIn, user } = useOutletContext();
  const additional = user ? dict[user.role] : dict["stranger"];

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.welcomeTitle}>
        Hello {isLoggedIn ? user.name : "stranger"}
      </h1>

      <p className={styles.description}>
        This platform helps you easily schedule and manage training sessions.
        Whether you're a trainee, trainer, or manager – everything you need is right here.
      </p>

      <ButtonGroup vertical className={styles.buttonGroup}>
        {additional && additional.map(btn => (
          <Button key={btn.name} className={styles.homeButton}>
            <NavLink className={styles.navLink} to={btn.link}>
              {btn.name}
            </NavLink>
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};
