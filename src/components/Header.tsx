// import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Header() {
  return (
    <>
      <header className="App-header">
          <Sidebar
            pageWrapId={"content"}
            outerContainerId={"App"}
          />
        <p>Mirrored-Keyboard Platform</p>

        {/* <Link to="/signup">
          <button className="navButton">Sign-up</button>
        </Link>
        <Link to="/login">
          <button className="navButton">Login</button>
        </Link> */}
      </header>
    </>
  );
}

export default Header;
