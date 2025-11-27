"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../lib/api/auth";
import { useRouter, usePathname } from "next/navigation";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Flex, Spinner } from "@radix-ui/themes";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useToast } from "../ToastProvider/ToastProvider";
import { queryClient } from "../../lib/react-query";

const Navbar = () => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const [navbarHidden, setNavbarHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const { user, setUser, isLoading } = useAuth();
  const router = useRouter();
  const { isSm } = useBreakpoint();
  const toast = useToast();
  const pathname = usePathname();

  const userInitials = user?.username?.slice(0, 2).toUpperCase() ?? "?";
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  // Only show auth buttons if we're done loading and no user
  const showAuthButtons = !isLoading && !user && !isLoggingOut;

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

  // When we reach the login page after logout, clear logging-out state
  useEffect(() => {
    if (pathname === "/login" && isLoggingOut) {
      setIsLoggingOut(false);
    }
  }, [pathname, isLoggingOut]);

  function closeHamburger() {
    setHamburgerOpen(false);
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      await logoutUser();

      setUser(null);
      queryClient.clear();

      toast.success("Logout successful");
      router.replace("/login");
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");

      setIsLoggingOut(false);
    }
  }

  return (
    <nav className={`navbar ${navbarHidden ? "hidden" : ""}`} ref={menuRef}>
      <div className="nav-header">
        <Link href="/">
          <div className="logo">Nexum</div>
        </Link>
        <ul className="nav-links-desktop desktop-only">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <ul
          className={`nav-links mobile-only ${hamburgerOpen ? "open" : "closed"}`}
          onClick={closeHamburger}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}

          {user ? (
            <li>
              {isLoggingOut ? (
                <Flex align={"center"} gap={"2"}>
                  <Spinner size="1" />
                  Logging out...
                </Flex>
              ) : (
                <a onClick={handleLogout}>Log Out</a>
              )}
            </li>
          ) : (
            showAuthButtons && (
              <>
                <li>
                  <Link href="/login">Log In</Link>
                </li>
                <li>
                  <Link href="/signup">Sign Up</Link>
                </li>
              </>
            )
          )}
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
          <div className="desktop-only">
            {user ? (
              <Button
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Spinner size="2" /> : "Log Out"}
              </Button>
            ) : (
              showAuthButtons && (
                <Flex gap={"4"}>
                  {!isLoginPage && (
                    <Link href="/login">
                      <Button color={"cyan"} style={{ cursor: "pointer" }}>
                        Log In
                      </Button>
                    </Link>
                  )}
                  {!isSignupPage && (
                    <Link href="/signup">
                      <Button style={{ cursor: "pointer" }}>Sign Up</Button>
                    </Link>
                  )}
                </Flex>
              )
            )}
          </div>
          <div className="mobile-only">
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
