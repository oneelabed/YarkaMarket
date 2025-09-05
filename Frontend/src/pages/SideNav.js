import "./SideNav.css"
import { Link } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "../components/UserContext";
import { Home, MessageCircle, Plus, User, Search, ShoppingBag } from "lucide-react";

function SideNav() {
  const { currentUser } = useContext(UserContext);

  return(
    <div>
      <nav className="sideNav"> 
        <div className="options">
          <Home id="icon" color="green" size={20}></Home><Link to="market" className="sidenav-item1">Marketplace</Link><br/><br/>
          <MessageCircle id="icon" color="blue" size={20}></MessageCircle><Link to="conversations" className="sidenav-item1">Messages</Link><br/><br/>
          <Plus id="icon" color="purple" size={20}></Plus><Link to="create-listing" className="sidenav-item1">Create Listing</Link><br/><br/>
          <ShoppingBag id="icon" color="orange" size={20}></ShoppingBag><Link to="my-listings" className="sidenav-item1">My Listings</Link><br/><br/>          
          {currentUser && currentUser.role === "ADMIN" && <><Link to="/admin" className="sidenav-item1" id="admin">Admin Page</Link><br/><br/></>}
        </div>
      </nav>
    </div>
  )
}

export default SideNav