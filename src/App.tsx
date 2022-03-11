import React from "react";

// https://reactrouter.com/docs/en/v6/getting-started/tutorial
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";

import Demo from "./pages/Demo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Status from "./pages/Status";
import Platform from "./pages/Platform";
import Error from "./pages/Error";

import {
  AxiosRequestConfig,
  // AxiosResponse
} from "axios";

import "./styles/App.css";

function App() {
  // API & Axios config
  const axiosConfig: AxiosRequestConfig<string> = {
    headers: {
      // 'Content-Length': 0,
      "Content-Type": "text/plain",
    },
    responseType: "json",
  };

  // const host = "http://localhost:8080";
  const host = "https://mirrored-keyboard.herokuapp.com";

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Demo host={host} axiosConfig={axiosConfig} />}
        ></Route>

        <Route path="/about" element={<></>}></Route>

        <Route path="/dashboard" element={<></>}></Route>

        <Route path="/status" element={<Status />}></Route>

        <Route
          path="/login"
          element={<Login host={host} axiosConfig={axiosConfig} />}
        ></Route>

        <Route
          path="/signup"
          element={<Signup host={host} axiosConfig={axiosConfig} />}
        ></Route>

        <Route
          path="/learn"
          element={<Platform host={host} axiosConfig={axiosConfig} />}
        ></Route>

        {/* fallback path, maps 404 errors */}
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
