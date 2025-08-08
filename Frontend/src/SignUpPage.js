import React, { useState } from "react";
import "./SignUpPage.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.password) {
      setError("Please fill in missing fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/signup", {
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
    <div className="signup-container">
      <form className="signup-form">
        <h2 className="signup-title">Sign Up</h2>

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
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            autoComplete="phone"
          />
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

        <button type="button" className="signup-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  )
}

export default SignUpPage