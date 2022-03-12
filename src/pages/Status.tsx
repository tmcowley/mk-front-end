import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { queryServiceStatus } from "../utils/api-calls";
import Sidebar from "../components/Sidebar";

function Status() {
  const navigate = useNavigate();

  const [apiDown, setAPIDown] = useState(false);

  queryServiceStatus(
    (response) => {
      setAPIDown(false);
    },
    (error) => {
      setAPIDown(true);
    }
  );

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
          isLoggedIn={false}
        ></Sidebar>
      </div>

      <div id="content">
        <div id="statusInfo">
          <h1 className="centre">Status</h1>
          <br />
          <br />
          <h3 className="centre" hidden={apiDown}>Back-end services operational</h3>
          <h3 className="centre" hidden={!apiDown}>Back-end services are inactive <br /> apologies for any inconvenience</h3>
        </div>
      </div>
    </div>
  );
}

export default Status;
