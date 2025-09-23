import Login from "./pages/Login.js"
import { Routes,Route } from "react-router-dom"
import SignUp from "./pages/SignUp.js"
import Home from "./pages/Home.js"
import Dashboard from "./pages/Dashboard.js"
import Market from "./pages/Marketplace.js"
import CreateListing from "./pages/CreateListing.js"
import MyListings from "./pages/MyListings.js"
import EditListing from "./pages/EditListing.js"
import Admin from "./pages/Admin.js"
import Messages from "./pages/Messages.js"
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import { Navigate } from "react-router-dom";
import "./App.css"

function PrivateRoute({ children }) {
  const token = sessionStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}>
          <Route path="market" element={<PrivateRoute><Market/></PrivateRoute>}></Route>
          <Route path="create-listing" element={<PrivateRoute><CreateListing/></PrivateRoute>}></Route>
          <Route path="my-listings" element={<PrivateRoute><MyListings/></PrivateRoute>}></Route>
          <Route path="conversations" element={<PrivateRoute><Messages/></PrivateRoute>}></Route>
          <Route path="edit-listing/:id" element={<PrivateRoute><EditListing/></PrivateRoute>}></Route>
        </Route>
        <Route path="/admin" element={<PrivateRoute><Admin/></PrivateRoute>}></Route>
      </Routes>
    </div>
  )
}

export default App