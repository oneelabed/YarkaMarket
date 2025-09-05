import Login from "./pages/Login.js"
import { Routes,Route } from "react-router-dom"
import SignUp from "./pages/SignUp.js"
import Home from "./pages/Home.js"
import Dashboard from "./pages/Dashboard.js"
import Nav from "./pages/Nav.js"
import Market from "./pages/Marketplace.js"
import CreateListing from "./pages/CreateListing.js"
import MyListings from "./pages/MyListings.js"
import EditListing from "./pages/EditListing.js"
import Admin from "./pages/Admin.js"
import Messages from "./pages/Messages.js"

function App() {
  return (
    <div className="App">
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="market" element={<Market/>}></Route>
          <Route path="create-listing" element={<CreateListing/>}></Route>
          <Route path="my-listings" element={<MyListings/>}></Route>
          <Route path="conversations" element={<Messages/>}></Route>
          <Route path="edit-listing/:id" element={<EditListing/>}></Route>
        </Route>
        <Route path="/admin" element={<Admin/>}></Route>
      </Routes>
    </div>
  )
}

export default App