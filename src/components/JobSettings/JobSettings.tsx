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

const followUpTimeOptions = ["1 Week", "2 Weeks", "3 Weeks"];

// TODO upcoming feature
const JobSettings = () => {
  const [ghostingPeriod, setGhostingPeriod] = useState<string>("4 Weeks");
  const [ghostingEnabled, setGhostingEnabled] = useState<boolean>(false);
  const [followUpPeriod, setFollowUpPeriod] = useState<string>("2 Weeks");
  const [followUpEnabled, setFollowUpEnabled] = useState<boolean>(false);

  const { isSm } = useBreakpoint();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton size={"3"} style={{ cursor: "pointer" }} radius={"small"}>
          <GearIcon width={24} height={24} />
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
              <Text>Mark as ghosted after</Text>
              <Flex align={"center"} gap={"2"} width={"fit-content"}>
                <Box style={{ flex: "1" }}>
                  <Dropdown
                    disabled={!ghostingEnabled}
                    name={ghostingPeriod}
                    options={ghostedTimeOptions}
                    onChange={(selected) => setGhostingPeriod(selected)}
                    width={isSm ? "100px" : "200px"}
                  />
                </Box>
                <Switch
                  style={{ cursor: "pointer" }}
                  size={"3"}
                  checked={ghostingEnabled}
                  onCheckedChange={() => setGhostingEnabled(!ghostingEnabled)}
                />
              </Flex>
            </Flex>
            <Flex
              direction={isSm ? "row" : "column"}
              align={isSm ? "center" : "start"}
              justify={"between"}
              gap={"2"}
            >
              <Text>Remind to follow up interview after</Text>
              <Flex align={"center"} gap={"2"} width={"fit-content"}>
                <Box style={{ flex: "1" }}>
                  <Dropdown
                    disabled={!followUpEnabled}
                    name={followUpPeriod}
                    options={followUpTimeOptions}
                    onChange={(selected) => setFollowUpPeriod(selected)}
                    width={isSm ? "100px" : "200px"}
                  />
                </Box>
                <Switch
                  style={{ cursor: "pointer" }}
                  size={"3"}
                  checked={followUpEnabled}
                  onCheckedChange={() => setFollowUpEnabled(!followUpEnabled)}
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
