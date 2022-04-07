import {useState, useLayoutEffect, useEffect} from "react";

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
          <h1 className="centre">Your User Code...</h1>

          <br /><br />
          
          <h3> {userCode === "" ? "User code goes here" : userCode} </h3>
        </div>
      </div>
    </div>
  );
}

export default DisplayCode;
