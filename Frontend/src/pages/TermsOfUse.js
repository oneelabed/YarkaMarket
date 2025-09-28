import "./PrivacyAndTerms.css";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

function TermsOfUse() {
  return (
    <div>
      <Helmet>
        <title>Yarka Market - TermsOfUse</title>
        <link rel="canonical" href="https://yarkamarket.org/terms" />
      </Helmet>
      <Link to="/" id="arrow"><ArrowLeft size={40}></ArrowLeft></Link>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Terms of Use</h1>
        <p><strong>Effective Date:</strong> September 23, 2025</p>

        <h2>1. Eligibility</h2>
        <ul>
          <li>You must be a citizen or resident of Yarka to use this app.</li>
          <li>You must provide accurate and truthful information when signing up (real name required).</li>
          <li>Accounts created with false or misleading information may be suspended or removed.</li>
        </ul>

        <h2>2. User Responsibilities</h2>
        <ul>
          <li>You are responsible for the content you post, including listings, descriptions, and messages.</li>
          <li>You may not post or sell illegal, harmful, or prohibited items.</li>
          <li>You may not harass, spam, or abuse other users.</li>
          <li>Respectful communication is required in all interactions.</li>
        </ul>

        <h2>3. Messaging</h2>
        <p>
          Messaging is provided to connect buyers and sellers. Harassment, threats, or
          inappropriate behavior will result in account suspension.
        </p>

        <h2>4. Our Rights</h2>
        <ul>
          <li>We may remove any content or account that violates these Terms.</li>
          <li>We may update these Terms at any time. Continued use of the app means you accept the updated Terms.</li>
        </ul>

        <h2>5. Disclaimer</h2>
        <p>
          Yarka Market is provided “as is.” We do not guarantee the accuracy of user
          listings or communications. We are not responsible for disputes between users.
        </p>
      </div>
    </div>
  );
}

export default TermsOfUse;