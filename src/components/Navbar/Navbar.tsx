"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../lib/api/auth";
import { useRouter, usePathname } from "next/navigation";
import { EnterIcon, ExitIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Avatar, IconButton } from "@radix-ui/themes";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useToast } from "../ToastProvider/ToastProvider";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userInitials = user?.username?.slice(0, 2).toUpperCase();
  const { isSm } = useBreakpoint();
  const toast = useToast();
  const pathname = usePathname();

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

  // Close hamburger when route changes to avoid stale open state after navigation
  useEffect(() => {
    closeHamburger();
  }, [pathname]);

  function closeHamburger() {
    setHamburgerOpen(false);
  }

  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      router.push("/login");
      toast.success("Logout successful");
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  }

  return (
    <nav className={`navbar ${navbarHidden ? "hidden" : ""}`} ref={menuRef}>
      <div className="nav-header">
        <Link href="/">
          <div className="logo">Nexum</div>
        </Link>
        <ul className="nav-links-desktop desktop-only">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
        <ul
          className={`nav-links mobile-only ${hamburgerOpen ? "open" : "closed"}`}
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
        <div className="container-right">
          {user && (
            <Avatar
              className="user-logo"
              size={"2"}
              color={"indigo"}
              fallback={userInitials!}
            />
          )}
          {/* Right-side: render three variants and let CSS show the correct one */}
          <div className="md-only">
            {user ? (
              <a onClick={handleLogout}>Log Out</a>
            ) : (
              <Link href="/login">Log In / Sign Up</Link>
            )}
          </div>

          <div className="sm-only">
            <IconButton color={"gray"}>
              {user ? (
                <ExitIcon
                  width={26}
                  height={20}
                  onClick={handleLogout}
                  color={"white"}
                />
              ) : (
                <Link href="/login" className="login-link">
                  <EnterIcon width={26} height={20} color={"white"} />
                </Link>
              )}
            </IconButton>
          </div>

          <div className="xs-only">
            <button
              className="hamburger-button"
              onClick={() => {
                setHamburgerOpen(!hamburgerOpen);
              }}
            >
              <HamburgerMenuIcon width={32} height={32} color={"white"} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
