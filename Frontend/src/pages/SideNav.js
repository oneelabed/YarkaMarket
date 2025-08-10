import "./SideNav.css"
import { Link } from "react-router-dom"

function SideNav() {
  return(
    <div>
      <nav className="sideNav"> 
        <div className="options">
          <Link to="market" className="sidenav-item1">Marketplace</Link><br/><br/>
          <h3 className="sidenav-item1">My Account</h3>
          <Link to="create-listing" className="sidenav-item1">Create Listing</Link><br/><br/>
          <Link to="mylistings" className="sidenav-item1">Your Listings</Link><br/><br/>
          <Link to="notifications" className="sidenav-item1">Notifications</Link><br/><br/>
        </div>
      </nav>
    </div>
  )
}

export default SideNav