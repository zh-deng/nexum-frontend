"use client";

import { useRouter } from "next/navigation";
import "./BottomMenu.scss";
import { Separator } from "@radix-ui/themes";
import { useState } from "react";

type MenuItem = {
  name: string;
  route: string;
};

const BottomMenu = () => {
  const router = useRouter();
  const menuItems: MenuItem[] = [
    {
      name: "Jobs",
      route: "jobs",
    },
    {
      name: "Interviews",
      route: "interviews",
    },
    {
      name: "Reminders",
      route: "reminders",
    },
    {
      name: "Statistics",
      route: "statistics",
    },
  ];
  const [activeItem, setActiveItem] = useState<string>("jobs");

  function navigateTo(route: string) {
    router.push(`/dashboard/${route}`);
    setActiveItem(route);
  }

  return (
    <div className="button-menu">
      {menuItems.map((item, index) => {
        return (
          <div className="item-container" key={item.name}>
            <div
              className={`menu-item ${activeItem === item.route ? "active-item" : ""}`}
              onClick={() => navigateTo(item.route)}
            >
              {item.name}
            </div>
            {index !== menuItems.length - 1 && (
              <Separator orientation="vertical" size={"4"} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BottomMenu;
