import React from "react";

// for ReactDOM.render(), e.g. ReactDOM.render(results, document.getElementById("results"));
// import ReactDOM from "react-dom";

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
  Link,
} from "react-router-dom";

function Login({
  host,
  axiosConfig,
}: {
  host: string;
  axiosConfig: AxiosRequestConfig;
}) {
  return (
    <div id="loginBody">
      <div id="login">
        <h1 className="centre">Login</h1>
        <p>
          Please login with your user-code <br />
          (of the form "word-word-word") <br />
          <br />
          Alternatively, <Link to="/sign-up">Sign up</Link>
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
          onSubmit={
            (values, { setSubmitting, resetForm, setStatus, setErrors }) => {
              // setTimeout(() => {
              //   alert(JSON.stringify(values, null, 2));
              //   setSubmitting(false);
              // }, 400);

              // validate user-code on back-end

              const path = "/post/login";
              const url = host + path;

              const data = {
                'userCode': values.userCode as string,
              };

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
                },
                (error) => {
                  console.log("user-code login API endpoint down/ failed");
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
                Submit
              </button>
            </Form>
          )}
        </Formik>

        {/* <form>
          <label htmlFor="age">Age:</label>
          <br />
          <input type="number" id="age" name="age" />
          <br />
          <label htmlFor="typing speed">Last name:</label>
          <br />
          <input type="number" id="speed" name="speed" />
        </form> */}
      </div>
    </div>
  );
}

export default Login;
