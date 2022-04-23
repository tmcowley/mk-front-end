import "../styles/Forms.css";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { useNavigate, Link } from "react-router-dom";

import { signUp } from "../utils/api-calls";

function SignUp() {
  const navigate = useNavigate();

  return (
    <div id="formBody">
      <div id="form">
        <h1 className="centre">Sign-up</h1>
        <p>
          Please sign-up using your current typing speed
          <br />
          <br />
          Alternatively, <Link className="link" to="/sign-in">Sign-in</Link> or{" "}
          <Link className="link" to="/">Return Home</Link>
        </p>

        <br />

        {/* https://formik.org/docs/overview */}
        <Formik
          initialValues={{
            // as empty strings to fix issue: A component is changing an uncontrolled input of type text to be controlled
            age: '',
            speed: '',
          }}
          validate={(values) => {
            type errorsType = {
              age: string | undefined;
              speed: string | undefined;
            }
            const errors: errorsType = {
              age: undefined,
              speed: undefined,
            }

            if (typeof values.age === 'string') {
              errors.age = "Age is required";
              return errors;
            }
            if (typeof values.speed === 'string') {
              errors.speed = "Typing speed is required";
              return errors;
            }

            const age: number | undefined = values.age as number
            const speed: number | undefined = values.speed as number

            // validate age
            if (!age) {
              errors.age = "Age is required";
            } else if (age < 13) {
              errors.age = "Minimum user-age is 13";
            } else if (age > 200) {
              errors.age = "You're over 200 years old, incredible!";
            }

            // validate speed
            if (!speed) {
              errors.speed = "Typing speed is required";
            } else if (speed < 0) {
              errors.speed = "Typing speed cannot be negative";
            } else if (speed > 400) {
              errors.speed = "Crikey, you're fast at typing!";
            }

            if (!errors.age && !errors.speed) {
              return {};
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            setTimeout(() => {
              // validate user-code on back-end
              signUp(
                {
                  age: Number(values.age), 
                  speed: Number(values.speed)
                },
                (response) => {
                  const userCode = response.data as string | null;
                  if (!userCode) {
                    setErrors({ age: "User sign-up failed" });
                    setSubmitting(false);
                  } 
                  else {
                    console.log("Notice: successful sign-up");
                    setSubmitting(true);
                    navigate("/display-user-code", { state: { test: "test" } });
                  }
                },
                (error) => {
                  setErrors({ age: "User sign-up failed" });
                  setSubmitting(false);
                }
              );
            }, 200);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="age">age: </label>
                    </td>
                    <td>
                      <Field type="number" name="age" />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label htmlFor="speed">speed: </label>
                    </td>
                    <td>
                      <Field type="number" name="speed" />
                    </td>
                  </tr>
                </tbody>
              </table>

              <br />

              <ErrorMessage name="age" component="div" />
              <ErrorMessage name="speed" component="div" />

              <br />

              <button type="submit" disabled={isSubmitting}>
                Sign-up
              </button>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUp;
