import "./SideNav.css"
import { Link } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "../components/UserContext";

function SideNav() {
  const { currentUser } = useContext(UserContext);

  return(
    <div>
      <nav className="sideNav"> 
        <div className="options">
          <Link to="market" className="sidenav-item1">Marketplace</Link><br/><br/>
          <h3 className="sidenav-item1">My Account</h3>
          <Link to="create-listing" className="sidenav-item1">Create Listing</Link><br/><br/>
          <Link to="my-listings" className="sidenav-item1">My Listings</Link><br/><br/>
          <Link to="conversations" className="sidenav-item1">Notifications</Link><br/><br/>
          {currentUser && currentUser.role === "ADMIN" && <><Link to="/admin" className="sidenav-item1" id="admin">Admin Page</Link><br/><br/></>}
        </div>
      </nav>
    </div>
  )
}

export default SideNav