import {
  Form as FormRouter,
  useActionData,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import styles from "../../styles/trainerWorkForm.module.css";
import { Form, InputGroup } from "react-bootstrap";
import { generateActionMsg } from "../../utils/utils";

const WorkDetailsForm = () => {
  const action = useActionData();
  const actionMsg = generateActionMsg(action);

  const { schedule } = useLoaderData();
  const allowedWorkouts = schedule.workouts;
  const haveWorkouts = allowedWorkouts.length > 0;

  const { user } = useOutletContext();
  const currentTrainerWorkouts = user.workouts;

  const daysOfWeek = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  return (
    <FormRouter className={styles.container} method="PUT">
      <InputGroup className={styles["input-group"]}>
        <Form.Group className={styles.formGroup}>
          <Form.Label htmlFor="workingHours[start]">
            Start hour of the day
          </Form.Label>
          <Form.Control
            defaultValue={user.workingHours.start}
            type="time"
            name="workingHours[start]"
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label htmlFor="workingHours[end]">
            End hour of the day
          </Form.Label>
          <Form.Control
            defaultValue={user.workingHours.end}
            type="time"
            name="workingHours[end]"
          />
        </Form.Group>
      </InputGroup>

      <Form.Group className={styles.formGroup}>
        <Form.Label htmlFor="restingDay">Resting Day</Form.Label>
        <Form.Select
          className={styles.restingDay}
          defaultValue={user.restingDay}
          name="restingDay"
        >
          {Object.entries(daysOfWeek).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {haveWorkouts && (
        <Form.Group className={styles.formGroup}>
          <Form.Label htmlFor="workouts">Workouts</Form.Label>
          <div className={styles.workoutGrid}>
            {allowedWorkouts.map((w) => (
              <label key={w} className={styles.workoutItem}>
                <input
                  type="checkbox"
                  defaultChecked={currentTrainerWorkouts.includes(w)}
                  name="workouts"
                  value={w}
                />
                {w}
              </label>
            ))}
          </div>
        </Form.Group>
      )}

      {actionMsg && actionMsg}

      <button type="submit" className={styles.button}>
        Update
      </button>
    </FormRouter>
  );
};

export default WorkDetailsForm;
