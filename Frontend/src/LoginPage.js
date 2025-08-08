import React, { useState } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom"

const LoginPage = () => {
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
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      //console.log(response);

      const responseData = await response.json();
      const key = Object.keys(responseData)[0];
      
      if (key === 'error') {
        setError(responseData.error);
        return;
      }


      const token = responseData.token;

      // Store token (in localStorage)
      localStorage.setItem("token", token);

      // Redirect (replace with your dashboard path)
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        
        <b id="signUpMsg">don't have an account? <Link to="/signup" id="SignUpLink">sign up</Link></b><br/><br/>
        <button type="button" className="login-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default LoginPage



