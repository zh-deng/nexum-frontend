import { Cross2Icon, GearIcon } from "@radix-ui/react-icons";
import "./JobSettings.scss";
import {
  Flex,
  Text,
  IconButton,
  Box,
  Switch,
  Dialog,
  Button,
} from "@radix-ui/themes";
import Dropdown from "../Dropdown/Dropdown";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useState } from "react";

const ghostedTimeOptions = [
  "2 Weeks",
  "3 Weeks",
  "4 Weeks",
  "6 Weeks",
  "8 Weeks",
  "12 Weeks",
];

const JobSettings = () => {
  const [period, setPeriod] = useState<string>("4 Weeks");
  // TODO add options entity to backend and frontend
  const [ghostingEnabled, setGhostingEnabled] = useState<boolean>(false);

  const { isSm } = useBreakpoint();

  function handleGhostingToggle() {
    setGhostingEnabled(!ghostingEnabled);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton size={"4"} style={{ cursor: "pointer" }}>
          <GearIcon width={32} height={32} />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content className="settings-modal">
        <Flex direction={"column"} justify={"between"} height={"100%"}>
          <Flex direction={"column"} gap={"4"}>
            <Flex justify={"end"}>
              <Dialog.Close>
                <IconButton
                  style={{ cursor: "pointer" }}
                  size={"3"}
                  radius={"small"}
                  color={"crimson"}
                >
                  <Cross2Icon width={32} height={32} />
                </IconButton>
              </Dialog.Close>
            </Flex>
            <Dialog.Title align={"center"}>Job Settings</Dialog.Title>
            <Flex
              direction={isSm ? "row" : "column"}
              align={isSm ? "center" : "start"}
              justify={"between"}
              gap={"2"}
            >
              <Text>Automatically Ghosted Status after</Text>
              <Flex align={"center"} gap={"2"} width={"fit-content"}>
                <Box style={{ flex: "1" }}>
                  <Dropdown
                    disabled={!ghostingEnabled}
                    name={period}
                    options={ghostedTimeOptions}
                    onChange={(selected) => setPeriod(selected)}
                    width={isSm ? "100px" : "200px"}
                  />
                </Box>
                <Switch
                  style={{ cursor: "pointer" }}
                  size={"3"}
                  checked={ghostingEnabled}
                  onCheckedChange={handleGhostingToggle}
                />
              </Flex>
            </Flex>
          </Flex>
          <Dialog.Close>
            <Button style={{ cursor: "pointer" }}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default JobSettings;
