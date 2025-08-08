import LoginPage from "./LoginPage.js";
import { Routes,Route } from "react-router-dom"
import SignUpPage from "./SignUpPage.js";
import HomePage from "./Homepage.js";
import DashboardPage from "./Dashboard.js";
import Nav from "./Nav.js";

const App = () => {

  return (
    <div className="App">
      <Nav/>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/signup" element={<SignUpPage/>}></Route>
        <Route path="/dashboard" element={<DashboardPage/>}></Route>
      </Routes>
    </div>
  )
}

export default App