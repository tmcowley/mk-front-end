import {useState, useLayoutEffect} from "react";

import {
  isSignedIn as APIisSignedIn,
  getUserCode as APIgetUserCode
} from "../utils/api-calls";
import Sidebar from "../components/Sidebar";

function DisplayCode() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userCode, setUserCode] = useState("");

  // fires before render
  // see: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
  useLayoutEffect(() => {

    APIisSignedIn((response) => {
      setLoggedIn(response.data as boolean);
    });
  }, []);

  useLayoutEffect(() => {
    if (!loggedIn) return

    // query user-code
    APIgetUserCode((response) => {
      setUserCode(response.data as string)
    })
  }, [loggedIn]);

  return (
    <div className="App" id="App">
      <div id="outer-container">
        <Sidebar
          pageWrapId={"content"}
          outerContainerId={"outer-container"}
          isLoggedIn={loggedIn}
        ></Sidebar>
      </div>

      <div id="content">
        <div id="statusInfo">
          <h1 className="centre">Your User Code</h1>

          <br />
          <h3>
            {
              userCode === ""
                  ? "Please sign-in to receive a user-code!"
                  : userCode
            }
          </h3>

          <br /><br />
          Please make a note of this! It's used when signing into your account.
          <br /><br /><br /><br />

          <a className="page-link" href="/">
          {
            userCode === ""
                ? "Return to the Demonstration Page"
                : "Enter the Learning Platform"
          }
          </a>

          <br /><br />
        </div>
      </div>
    </div>
  );
}

export default DisplayCode;
