import { useState } from "react";

import { queryServiceStatus, isLoggedIn } from "../utils/api-calls";
import Sidebar from "../components/Sidebar";

function Status() {
  const [apiDown, setAPIDown] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  queryServiceStatus(
    (response) => {
      setAPIDown(false);
    },
    (error) => {
      setAPIDown(true);
    }
  );

  isLoggedIn((response) => {
    setLoggedIn(response.data as boolean);
  });

  // function InactiveApiNotification() {
  //   return (
  //     <div id="inactiveNotification">
  //       Back-end services are inactive - apologies for any inconvenience
  //     </div>
  //   );
  // }

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
          </h3>
          <h3 className="centre" hidden={!apiDown}>
            Back-end services are inactive <br /> 
            apologies for any inconvenience
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Status;
