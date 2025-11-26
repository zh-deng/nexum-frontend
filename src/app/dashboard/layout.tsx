"use client";

import "./dashboard.scss";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've finished loading and there's no user
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Show loading or wait for redirect
  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <main className="dashboard-content">{children}</main>
      <BottomMenu />
    </div>
  );
}
