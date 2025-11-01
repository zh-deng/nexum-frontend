"use client";

import { useRouter } from "next/navigation";
import "./BottomMenu.scss";
import { SegmentedControl, Separator } from "@radix-ui/themes";
import { useState } from "react";
import { useBreakpoint } from "../../hooks/useBreakpoint";

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
  const { isSm } = useBreakpoint();

  function navigateTo(route: string) {
    router.push(`/dashboard/${route}`);
    setActiveItem(route);
  }

  return (
    <div className="button-menu">
      {isSm ? (
        <SegmentedControl.Root
          defaultValue={activeItem}
          radius="medium"
          size={"3"}
        >
          {menuItems.map((item) => {
            return (
              <SegmentedControl.Item
                style={{ cursor: "pointer" }}
                value={item.route}
                key={item.name}
                onClick={() => navigateTo(item.route)}
              >
                {item.name}
              </SegmentedControl.Item>
            );
          })}
        </SegmentedControl.Root>
      ) : (
        <>
          {menuItems.map((item, index) => (
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
          ))}
        </>
      )}
    </div>
  );
};

export default BottomMenu;
