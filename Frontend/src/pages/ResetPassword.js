import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token, newPassword }),
      });

      const data = await res.text();
      setMessage(data);

      if (data.includes("successfully")) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <p>Invalid or missing token.</p>;

  return (
    <div>
        <Nav/>
        <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
            {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
        {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    </div>
  );
}

export default ResetPassword;
