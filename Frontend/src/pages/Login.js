import React, { useState } from "react";
import "./Login.css";
import Nav from "./Nav";
import { Link } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Login () {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      // console.log(response);

      const responseData = await response.json();
      const key = Object.keys(responseData)[0];
      
      if (key === 'error') {
        setError(responseData.error);
        return;
      }


      const token = responseData.token;

      sessionStorage.setItem("token", token);

      const res = await fetch(`${apiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}`,
                    credentials: "include" }
      });
      const data = await res.json();
      setCurrentUser(data);

      // Redirect
      window.location.href = "/dashboard/market";
    } catch (err) {
      // console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav/>
      <div className="login-container">
        <form className="login-form">
          <h2 className="login-title">Login</h2>

          

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
          
          <b id="signUpMsg">Don't have an account? <Link to="/signup" id="SignUpLink">Sign Up</Link></b><br/><br/>
          <button type="button" className="login-button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login



