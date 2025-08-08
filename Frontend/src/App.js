import Login from "./Login.js";
import { Routes,Route } from "react-router-dom"
import SignUp from "./SignUp.js";
import Home from "./Home.js";
import Dashboard from "./Dashboard.js";
import Nav from "./Nav.js";

const App = () => {

  return (
    <div className="App">
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </div>
  )
}

export default App