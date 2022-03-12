// import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Header({isLoggedIn}: {isLoggedIn: boolean}) {
  return (
    <>
      <header className="App-header">
          <Sidebar
            pageWrapId={"content"}
            outerContainerId={"App"}
            isLoggedIn={isLoggedIn}
          />
        <p>Mirrored-Keyboard Platform</p>
      </header>
    </>
  );
}

export default Header;
