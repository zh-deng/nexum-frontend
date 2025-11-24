"use client";

import "./dashboard.scss";
import BottomMenu from "../../components/BottomMenu/BottomMenu";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-page">
      <main className="dashboard-content">{children}</main>
      <BottomMenu />
    </div>
  );
}
