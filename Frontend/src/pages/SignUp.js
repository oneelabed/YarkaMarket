import { useState } from "react";
import "./SignUp.css";
import Nav from "./Nav";
import { Link } from "react-router-dom"

function SignUp() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in missing fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      
      const responseData = await response.json();
      const key = Object.keys(responseData)[0];
      
      if (key === 'error') {
        setError(responseData.error);
        return;
      }

      const token = responseData.token;

      sessionStorage.setItem("token", token);

      // Redirect (replace with your dashboard path)
      window.location.href = "/dashboard/market";
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav/>
      <div className="signup-container">
        
        <form className="signup-form">
          <h2 className="signup-title">Sign Up</h2><br/>

          <div className="form-group name-fields">
            <div className="name-input">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                id="first"
                autoComplete="firstName"
              />
            </div>

            <div className="name-input">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                id="last"
                autoComplete="lastName"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}<br/>

          <b id="LoginMsg">Already have an account? <Link to="/login" id="LoginLink">Log In</Link></b><br/><br/>
          <button type="button" className="signup-button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp