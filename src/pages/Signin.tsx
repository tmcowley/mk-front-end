import "../styles/Forms.css";

import { Formik, Form, Field, ErrorMessage } from "formik";

import {
  // BrowserRouter as Router,
  // Routes,
  // Route,
  useNavigate, 
  Link,
} from "react-router-dom";

import { signIn } from '../utils/api-calls'

function Signin() {
  const navigate = useNavigate();

  return (
    <div id="formBody">
      <div id="form">
        <h1 className="centre">Sign-in</h1>
        <p>
          Please sign-in with your user-code <br />
          (of the form "word-word-word") <br />
          <br />
          Alternatively, <Link to="/sign-up">Sign-up</Link> or <Link to="/">Return Home</Link>
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
            (values, { setSubmitting, setErrors }) => {
              setTimeout(() => {
                // sign-in user using their user-code
                signIn(
                  values, 
                  (response) => {
                    const userLoggedIn = response.data as boolean;
                    if (!userLoggedIn) {
                      setErrors({ userCode: "user-code does not exist" })
                      setSubmitting(false);
                    } else {
                      console.log("Notice: successful login")
                      setSubmitting(true);
                      navigate("/")
                    }
                  }, 
                  (error) => {
                    setErrors({ userCode: "user-code login failed" })
                    setSubmitting(false);
                  }
                )
              }, 200);            
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

export default Signin;
