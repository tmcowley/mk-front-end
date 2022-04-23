import {useState, useLayoutEffect, useEffect} from "react";

import { queryServiceStatus as APIqueryServiceStatus, isSignedIn } from "../utils/api-calls";
import Sidebar from "../components/Sidebar";

function Status() {
  const [apiDown, setAPIDown] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  // fires before render
  // see: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
  useLayoutEffect(() => {
    queryServiceStatus()

    isSignedIn((response) => {
      setLoggedIn(response.data as boolean);
    });
  }, []);

  useEffect(() => {
    // query API status every second
    setInterval(() => {
      queryServiceStatus()
    }, 1000)
  }, [])

  // query the api state
  function queryServiceStatus() {
    APIqueryServiceStatus(
        () => {
          setAPIDown(false)
        },
        () => {
          setAPIDown(true)
        }
    );
  }

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
          <h1 className="centre">Status</h1>

          <br /><br />
          
          <h3 className="centre" hidden={apiDown}>
            Back-end services operational

            <br /><br /><br /><br />

            <a className="page-link" href="/">
              Return Home
            </a>
          </h3>
          <h3 className="centre" hidden={!apiDown}>
            Back-end services are inactive. <br />
            Apologies for any inconvenience.
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Status;
