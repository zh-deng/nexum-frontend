"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../lib/api/auth";
import { useRouter } from "next/navigation";
import { EnterIcon, ExitIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Avatar } from "@radix-ui/themes";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userInitials = user?.username?.slice(0, 2).toUpperCase();
  const { isSm, isMd } = useBreakpoint();

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

  useEffect(() => {
    setHamburgerOpen(false);
  }, [isSm]);

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
        {isSm ? (
          <ul className="nav-links-desktop">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </ul>
        ) : (
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
        )}
        <div className="container-right">
          {user && (
            <Avatar
              className="user-logo"
              size={"2"}
              color={"indigo"}
              fallback={userInitials!}
            />
          )}
          {isMd ? (
            <>
              {user ? (
                <a onClick={handleLogout}>Log Out</a>
              ) : (
                <Link href="/login">Log In / Sign Up</Link>
              )}
            </>
          ) : (
            <>
              {isSm ? (
                <button className="login-logout-button">
                  {user ? (
                    <ExitIcon width={26} height={20} onClick={handleLogout} />
                  ) : (
                    <Link href="/login">
                      <EnterIcon width={26} height={20} />
                    </Link>
                  )}
                </button>
              ) : (
                <button
                  className="hamburger-button"
                  onClick={() => setHamburgerOpen(!hamburgerOpen)}
                >
                  <HamburgerMenuIcon width={32} height={32} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
