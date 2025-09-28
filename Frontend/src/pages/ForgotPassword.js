import { useState } from "react";
import Nav from "./Nav";
import "./ForgotPassword";
import { Helmet } from "react-helmet-async";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });

      const data = await res.text();
      setMessage(data);
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <Helmet>
          <title>Yarka Market - Forgot Password</title>
          <link rel="canonical" href="https://yarkamarket.org/forgot-password" />
        </Helmet>
        <Nav/>
        <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }} className="forgot-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="input-forgot"
            />
            <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
            {loading ? "Sending..." : "Send Reset Link"}
            </button>
        </form>
        {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    </div>
  );
}

export default ForgotPassword;
