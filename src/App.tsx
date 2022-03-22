// import { useEffect, useState } from "react";

// https://reactrouter.com/docs/en/v6/getting-started/tutorial
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";

import Platform from "./pages/Platform";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Status from "./pages/Status";
import Error from "./pages/Error";
import Signout from "./pages/Signout";

import "./styles/App.css";

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

        <Route path="/sign-in" element={<Signin />}></Route>

        <Route path="/sign-up" element={<Signup />}></Route>

        <Route path="/sign-out" element={<Signout />}></Route>

        {/* fallback path, maps 404 errors */}
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
