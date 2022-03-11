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

function Login({
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
        <h1 className="centre">Login</h1>
        <p>
          Please login with your user-code <br />
          (of the form "word-word-word") <br />
          <br />
          Alternatively, <Link to="/signup">Sign-up</Link> or <Link to="/">Return Home</Link>
        </p>

        <br />

        {/* https://formik.org/docs/overview */}
        <Formik
          initialValues={{ userCode: "" }}
          validate={(values) => {
            type errorsType = {
              userCode: string | undefined;
            };
            const errors: errorsType = { userCode: undefined };
            const userCode: string | undefined = values.userCode;

            // validate user-code
            if (!userCode) {
              errors.userCode = "user-code is required";
            } else if ((userCode as string).length !== 5 + 1 + 5 + 1 + 5) {
              errors.userCode = "user-code invalid";
            } else if (true) {
              const userCodeSplit: string[] = (userCode as string).split("-");

              if (userCodeSplit.length !== 3) {
                errors.userCode = "user-code invalid";
              }

              if (!userCodeSplit.every((split: string) => split.length === 5)) {
                errors.userCode = "user-code invalid";
              }
            }

            if (!errors.userCode) return {};
            return errors;
          }}
          
          // https://stackoverflow.com/questions/60705833/how-disable-the-auto-reset-form-on-submit-in-formik
          onSubmit={
            (values, { setSubmitting, resetForm, setStatus, setErrors }) => {
              // setTimeout(() => {
              //   alert(JSON.stringify(values, null, 2));
              //   setSubmitting(false);
              // }, 400);

              // validate user-code on back-end

              const path = "/post/login";
              const url = host + path;

              const data = JSON.stringify(values, null, 2)

              // const data = {
              //   'userCode': values.userCode as string,
              // };

              axiosConfig["headers"] = {
                // 'Content-Length': 0,
                "Content-Type": "application/json"
              }

              axios.post(url, data, axiosConfig).then(
                (response) => {
                  // console.log("queryAPIStatus() - Response found");
                  console.log(response);

                  const userLoggedIn = response.data as boolean;
                  if (!userLoggedIn) {
                    setErrors({userCode: "user-code does not exist"})
                    setSubmitting(false);
                    return;
                  }

                  console.log("Notice: successful login")
                  setSubmitting(true);
                  navigate("/learn")
                },
                (error) => {
                  console.log("Error: user login failed");
                  setErrors({userCode: "user-code login failed"})
                  setSubmitting(false);
                  return;
                }
              );
            }
          }
        >
          {({ isSubmitting }) => (
            <Form>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="userCode">user-code: </label>
                    </td>
                    <td>
                      <Field
                        type="string"
                        name="userCode"
                        maxLength={17}
                        autoComplete="off"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <br />

              <ErrorMessage name="userCode" component="div" />

              <br />

              <button type="submit" disabled={isSubmitting}>
                Login
              </button>
            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}

export default Login;
