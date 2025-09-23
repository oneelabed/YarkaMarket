import "./SideNav.css"
import { Link, NavLink } from "react-router-dom"
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Home, MessageCircle, Plus, User, ShoppingBag, UserCog} from "lucide-react";
import blackLogo from "../images/marketLogoBlack.png"

function SideNav() {
  const { currentUser } = useContext(UserContext);

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
            <MessageCircle className="icon" color="blue" size={20}></MessageCircle>
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