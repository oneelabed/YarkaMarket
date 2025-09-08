import "./SideNav.css"
import { Link } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "../components/UserContext";
import { Home, MessageCircle, Plus, User, ShoppingBag, UserCog} from "lucide-react";
import blackLogo from "../images/marketLogoBlack.png"

function SideNav() {
  const { currentUser } = useContext(UserContext);

  return(
    <div>
      <nav className="sideNav">
        <Link to="/"><img alt="logo" src={blackLogo} id="blackLogo"></img><br/></Link>
        <div className="options">
          <User id="icon" color="black" size={40} style={{marginLeft:"7px"}}></User><b className="sidenav-item1" id="name"> {currentUser && currentUser.username}</b><br/><br/><br/><br/>
          <Home id="icon" color="green" size={20}></Home><Link to="market" className="sidenav-item1">Marketplace</Link><br/><br/>
          <MessageCircle id="icon" color="blue" size={20}></MessageCircle><Link to="conversations" className="sidenav-item1">Messages</Link><br/><br/>
          <Plus id="icon" color="purple" size={20}></Plus><Link to="create-listing" className="sidenav-item1">Create Listing</Link><br/><br/>
          <ShoppingBag id="icon" color="orange" size={20}></ShoppingBag><Link to="my-listings" className="sidenav-item1">My Listings</Link><br/><br/>          
          {currentUser && currentUser.role === "ADMIN" && <><UserCog id="icon" color="brown" size={20}></UserCog><Link to="/admin" className="sidenav-item1" id="admin">Admin Page</Link><br/><br/></>}
        </div>
      </nav>
    </div>
  )
}

export default SideNav