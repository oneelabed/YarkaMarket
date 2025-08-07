import React, { useState } from "react";
import LoginPage from "./LoginPage.js";
import { Routes,Route } from "react-router-dom"
import SignUpPage from "./SignUpPage.js";
import HomePage from "./Homepage.js";
import DashboardPage from "./DashboardPage.js";

const App = () => {
  return (
    <div className="App">
      <LoginPage/>
      <Routes>
        <Route path="/yarkaMarket/" element={<HomePage/>}></Route>
        <Route path="/yarkaMarket/login" element={<LoginPage/>}></Route>
        <Route path="/yarkaMarket/signup" element={<SignUpPage/>}></Route>
        <Route path="/yarkaMarket/dashboard" element={<DashboardPage/>}></Route>
      </Routes>
      
    </div>
  );
};

export default App;