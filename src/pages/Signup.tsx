import React from "react";

import axios, {
  AxiosRequestConfig,
  // AxiosResponse
} from "axios";

import "../styles/Forms.css";

import { Formik, Form, Field, ErrorMessage } from "formik";

import {
  // BrowserRouter as Router,
  // Routes,
  // Route,
  useNavigate,
  Link,
} from "react-router-dom";

function Signup({
  host,
  axiosConfig,
}: {
  host: string;
  axiosConfig: AxiosRequestConfig;
}) {
  const navigate = useNavigate();

  return (
    <div id="formBody">
      <div id="form">
        <h1 className="centre">Sign-up</h1>
        <p>
          Please sign-up using your current typing speed
          <br /><br />
          Alternatively, <Link to="/login">Login</Link> or <Link to="/">Return Home</Link>
        </p>

        <br />

        {/* https://formik.org/docs/overview */}
        <Formik
          initialValues={{
            age: undefined,
            speed: undefined,
            general: undefined,
          }}
          validate={(values) => {
            type errorsType = {
              age: string | undefined;
              speed: string | undefined;
              general: string | undefined;
            };
            const errors: errorsType = {
              age: undefined,
              speed: undefined,
              general: undefined,
            };
            const age: number | undefined = values.age;
            const speed: number | undefined = values.speed;

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
              const path = "/post/signup";
              const url = host + path;

              const data = JSON.stringify(values, null, 2);

              // const data = {
              //   'userCode': values.userCode as string,
              // };

              axiosConfig["headers"] = {
                // 'Content-Length': 0,
                "Content-Type": "application/json",
              };

              axios.post(url, data, axiosConfig).then(
                (response) => {
                  console.log(response);

                  const userCode = response.data as string | null;

                  if (!userCode) {
                    setErrors({ general: "User sign-up failed" });
                    setSubmitting(false);
                    return;
                  }

                  console.log("Notice: successful sign-up");
                  setSubmitting(true);
                  navigate("/learn");
                },
                (error) => {
                  console.log("Error: user sign-up failed");
                  setErrors({ general: "User sign-up failed" });
                  setSubmitting(false);
                  return;
                }
              );
            }, 400);
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

export default Signup;
