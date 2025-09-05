import "./Nav.css"
import {Link} from "react-router-dom";
import logo from "../images/marketLogo.png"

function Nav() {
  return(
    <div>
      <nav className="nav"> 
        <div className="logo">
            <Link to="/" className="nav-item2"><img alt="logo" src={logo} id="logo"></img></Link>
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