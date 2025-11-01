import { Cross2Icon, GearIcon } from "@radix-ui/react-icons";
import "./JobSettings.scss";
import { Flex, Text, IconButton, Box, Switch } from "@radix-ui/themes";
import Dropdown from "../Dropdown/Dropdown";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useState } from "react";

const JobSettings = () => {
  const ghostedTimeOptions = [
    "2 Weeks",
    "3 Weeks",
    "4 Weeks",
    "6 Weeks",
    "8 Weeks",
    "12 Weeks",
  ];
  const { isSm } = useBreakpoint();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>("4 Weeks");
  // TODO add options entity to backend and frontend
  const [ghostingEnabled, setGhostingEnabled] = useState<boolean>(false);

  function handleGhostingToggle() {
    setGhostingEnabled(!ghostingEnabled);
  }

  return (
    <div className="job-settings">
      <IconButton
        size={"4"}
        onClick={() => setModalOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <GearIcon width={32} height={32} />
      </IconButton>
      {modalOpen && (
        <div className="settings-modal">
          <Flex direction={"column"} gap={"4"}>
            <Flex justify={"end"}>
              <IconButton
                style={{ cursor: "pointer" }}
                size={"4"}
                radius={"small"}
                onClick={() => setModalOpen(false)}
              >
                <Cross2Icon width={32} height={32} />
              </IconButton>
            </Flex>
            <Text align={"center"} weight={"bold"} size={"5"}>
              Job Options
            </Text>
            <Flex align={"center"} justify={"between"} gap={"2"}>
              <Flex
                align={"center"}
                direction={isSm ? "row" : "column"}
                width={"90%"}
                gap={"2"}
              >
                <Text style={{ flex: 1 }}>
                  Automatically Ghosted Status after
                </Text>
                <Dropdown
                  disabled={!ghostingEnabled}
                  width={isSm ? "40%" : "60%"}
                  name={period}
                  options={ghostedTimeOptions}
                  onChange={(selected) => setPeriod(selected)}
                />
              </Flex>
              <Switch
                style={{ cursor: "pointer" }}
                size={"3"}
                checked={ghostingEnabled}
                onCheckedChange={handleGhostingToggle}
              />
            </Flex>
          </Flex>
        </div>
      )}
    </div>
  );
};

export default JobSettings;
