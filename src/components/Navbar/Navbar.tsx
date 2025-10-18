"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../lib/api/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userInitials = user?.username?.slice(0, 2).toUpperCase();

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeHamburger();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 50) {
        setNavbarHidden(true);
      } else {
        setNavbarHidden(false);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  function closeHamburger() {
    setHamburgerOpen(false);
  }

  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      router.push("/login");
    } catch (error: unknown) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className={`navbar ${navbarHidden ? "hidden" : ""}`} ref={menuRef}>
      <div className="nav-header">
        <div className="logo">Nexum</div>
        <div className="container-right">
          {user && <div className="user-logo">{userInitials}</div>}
          <button
            className="hamburger"
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            ☰
          </button>
        </div>
      </div>
      <ul
        className={`nav-links ${hamburgerOpen ? "open" : ""}`}
        onClick={closeHamburger}
      >
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          {user ? (
            <button onClick={handleLogout}>
              <a>Log Out</a>
            </button>
          ) : (
            <Link href="/login">Log In / Sign Up</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
