"use client";

import Link from "next/link";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="brand">
          <div className="logo">Nexum</div>
          <p className="tag">Job hunting, simplified.</p>
        </div>

        <div className="links">
          <div className="col">
            <h4>Product</h4>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/signup">Sign Up</Link>
          </div>
          <div className="col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>

      <div className="copyright">
        © {new Date().getFullYear()} Nexum — Built by Zhihao.
      </div>
    </footer>
  );
};

export default Footer;
