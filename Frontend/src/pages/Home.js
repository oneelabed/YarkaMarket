import "./Home.css";
import Nav from "./Nav";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homepage">
      <Nav/>
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Yarka Market</h1>
          <p>The first ever yarka citizens only Marketplace!</p>
          <p>Buy and sell anything in your community — fast, simple, secure.</p>
        </div>
      </section>

      <section className="why-use">
        <h2>Why Use Yarka Market?</h2>
        <div className="reasons">
          <div className="reason-card">
            <span>✅</span>
            <p>Easy to use platform for buying and selling</p>
          </div>
          <div className="reason-card">
            <span>🔒</span>
            <p>Secure messaging between buyers and sellers</p>
          </div>
          <div className="reason-card">
            <span>🤝</span>
            <p>Community-driven marketplace</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Yarka Market. All rights reserved.</p>
        <p>
          <Link to="/terms" className="footer-link">Terms of Use</Link> |{" "}
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}

export default Home;
