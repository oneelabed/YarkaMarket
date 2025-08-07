import React, { useState } from "react";
import LoginPage from "./LoginPage.js";
import { Routes,Route } from "react-router-dom"
import SignUpPage from "./SignUpPage.js";
import dashboardPage from "./dashboardPage.js"

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/signup" element={<SignUpPage/>}></Route>
        <Route path="/dashboard" element={<dashboardPage/>}></Route>
      </Routes>
      <LoginPage/>
    </div>
  );
};

export default App;