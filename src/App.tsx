// import { useEffect, useState } from "react";

// https://reactrouter.com/docs/en/v6/getting-started/tutorial
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";

import Platform from "./pages/Platform";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Status from "./pages/Status";
import Error from "./pages/Error";
import SignOut from "./pages/SignOut";

import "./styles/App.css";
import DisplayCode from "./pages/DisplayCode";

// import { isLoggedIn as APIisLoggedIn } from "./utils/api-calls";

function App() {
  // const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //   APIisLoggedIn((response) => {
  //     setLoggedIn(response.data as boolean);
  //   });
  // }, []);

  return (
    <Router>
      <Routes>
        {/*         <Route path="/" element={<Platform loggedIn={loggedIn} />}></Route> */}
        <Route path="/" element={<Platform/>}></Route>

        <Route path="/status" element={<Status />}></Route>

        <Route path="/display-user-code" element={<DisplayCode />}></Route>

        <Route path="/sign-in" element={<SignIn />}></Route>

        <Route path="/sign-up" element={<SignUp />}></Route>

        <Route path="/sign-out" element={<SignOut />}></Route>

        {/* fallback path, maps 404 errors */}
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
