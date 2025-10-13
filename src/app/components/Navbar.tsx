"use client";

import Link from "next/link";
import { useState } from "react";
import "./Navbar.scss";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-header">
        <div className="logo">Nexum</div>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/about">Sign In / Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}
