import "./SideNav.css"
import { useState } from "react"
import {Link} from "react-router-dom";
function SideNav() {

  /*const handleChange = () => {
    setDark(!isDark)
    
    if (githubLogo === githubLogoBlack)
      setGithub(githubLogoWhite)
    else
      setGithub(githubLogoBlack)

    if (linkedinLogo === linkedinLogoBlack)
      setLinkedin(linkedinLogoWhite)
    else
      setLinkedin(linkedinLogoBlack)
  }*/
  
  return(
    <div>
      <nav className="sideNav"> 
        <div className="options">
            <Link to="/dashboard" className="sidenav-item1">Marketplace</Link><br/><br/>
            <h3 className="sidenav-item1">My Account</h3>
            <Link to="/dashboard/mylistings" className="sidenav-item1">Your Listings</Link><br/><br/>
            <Link to="/dashboard/notifications" className="sidenav-item1">Notifications</Link>     
        </div>
      </nav>
    </div>
  )
}

export default SideNav