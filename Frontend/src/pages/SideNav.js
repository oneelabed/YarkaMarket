import "./SideNav.css"
import { Link, NavLink } from "react-router-dom"
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Home, MessageCircle, Plus, User, ShoppingBag, UserCog } from "lucide-react";
import blackLogo from "../images/marketLogoBlack.png"

function SideNav() {
  const { currentUser } = useContext(UserContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token)
      return;

    const fetchUnreadCount = async () => {
      const res = await fetch(`${apiUrl}/dashboard/unreadCount/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const count = await res.json();
        setUnreadCount(count);
      }
    };

    if (currentUser) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 3000);
      return () => clearInterval(interval);
    }
  }, [currentUser, token, apiUrl]);

  return(
    <div>
      <nav className="sideNav">
        <Link to="/"><img alt="logo" src={blackLogo} id="blackLogo"></img><br/></Link>
        <div className="options">
          <User className="icon" color="black" size={40} style={{marginLeft:"7px"}} id="user-icon"></User><b className="sidenav-word" id="name"> {currentUser && currentUser.username}</b><br/><br/><br/><br/>
          <div className="sidenav-item">
            <NavLink to="market" 
              className={({ isActive }) => `${ isActive ? "active-sidenav" : "unactive-sidenav"}`}>
            <Home className="icon" color="green" size={20}></Home>
            <span className="sidenav-word">Marketplace&nbsp;&nbsp;&nbsp;</span>
            </NavLink>
          </div><br/>
          <div className="sidenav-item">
            <NavLink to="conversations" 
              className={({ isActive }) => `${ isActive ? "active-sidenav" : "unactive-sidenav"}`}>
            <div className="message-icon-container">
              <MessageCircle className="icon" color="blue" size={20}/>
              {unreadCount > 0 && (
                <span className="message-badge">{unreadCount}</span>
              )}
            </div>
            <span className="sidenav-word">Messages&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </NavLink>
          </div><br/>
          <div className="sidenav-item">
            <NavLink to="create-listing" 
            className={({ isActive }) => `${ isActive ? "active-sidenav" : "unactive-sidenav"}`}>
            <Plus className="icon" color="purple" size={20}></Plus>
            <span className="sidenav-word">Create Listing</span>
            </NavLink>
          </div><br/>
          <div className="sidenav-item">
            <NavLink to="my-listings" 
              className={({ isActive }) => `${ isActive ? "active-sidenav" : "unactive-sidenav"}`}>
            <ShoppingBag className="icon" color="orange" size={20}></ShoppingBag>
            <span className="sidenav-word">My Listings&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </NavLink>
          </div><br/>          

          {currentUser && currentUser.role === "ADMIN" &&
            <>
              <div className="sidenav-item">
                <NavLink to="/admin" 
                  className={({ isActive }) => `${ isActive ? "active-sidenav" : "unactive-sidenav"}`}>
                <UserCog className="icon" color="brown" size={20}></UserCog>
                <span className="sidenav-word">Admin Page&nbsp;&nbsp;&nbsp;</span>
                </NavLink>
              </div>
            </>
          }
        </div>
      </nav>
    </div>
  )
}

export default SideNav