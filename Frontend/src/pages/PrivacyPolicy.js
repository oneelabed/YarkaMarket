import { Link } from "react-router-dom";
import "./PrivacyAndTerms.css";
import { ArrowLeft } from "lucide-react";

function PrivacyPolicy() {
  return (
    <div>
      <Link to="/" id="arrow"><ArrowLeft size={40}></ArrowLeft></Link>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto"}}>
        <h1>Privacy Policy</h1> 
        <p><strong>Effective Date:</strong> September 23, 2025</p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Account Information:</strong> Name, username, and email (provided during signup).</li>
          <li><strong>Listings:</strong> Items you post, including titles, descriptions, and images.</li>
          <li><strong>Messages:</strong> Conversations you send and receive with other users.</li>
          <li><strong>Technical Data:</strong> Basic device and usage data to improve the app.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide the marketplace service (listings, messaging, account access).</li>
          <li>To verify accounts and prevent fake users.</li>
          <li>To maintain safety and moderate inappropriate content.</li>
        </ul>

        <h2>3. How We Protect Your Data</h2>
        <ul>
          <li>Information is stored securely in our database (PostgreSQL).</li>
          <li>Authentication uses secure tokens (JWT).</li>
          <li>Only authorized administrators can access data for moderation purposes.</li>
        </ul>

        <h2>4. What We Do Not Do</h2>
        <ul>
          <li>We do not sell or share your personal data with third parties.</li>
          <li>We do not process any payments through the app.</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>
          You may request deletion of your account and personal information. You may contact
          us at <strong>oneelabed123@gmail.com</strong> for privacy-related requests.
        </p>

        <h2>6. Updates</h2>
        <p>
          We may update this Privacy Policy from time to time. If changes are made, we will
          notify users within the app.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;