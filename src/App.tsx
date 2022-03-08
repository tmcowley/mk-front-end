import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";

import Demo from "./pages/Demo";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Demo />}>
        </Route>

        <Route path="/about" element={<></>}>
        </Route>

        <Route path="/dashboard" element={<></>}>
        </Route>

        <Route path="/login" element={<></>}>
        </Route>

        <Route path="/sign-up" element={<></>}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
