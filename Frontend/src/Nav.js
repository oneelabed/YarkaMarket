import "./Nav.css"
import { useState } from "react"
import {Link} from "react-router-dom";
const Nav = () => {

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
      <nav className="nav"> 
        <div className="logo">
            <Link to="/" className="nav-item2"><img src="marketLogo.png" id="logo"></img></Link>
        </div>
        <div className="paths">
          <Link to="/signup" className="nav-item1">Sign Up</Link>
          <Link to="/login" className="nav-item1">Log In</Link>     
        </div>
      </nav>
    </div>
  )
}

export default Nav