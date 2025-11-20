"use client";

import { Avatar, Badge, Box, Card, Flex, Text } from "@radix-ui/themes";
import "./ApplicationCard.scss";
import { StarFilledIcon, StarIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useRef } from "react";
import { calculateDays } from "../../utils/helper";
import { ApplicationDto } from "../../types/dtos/application/application.dto";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import NewBadge from "../NewBadge/NewBadge";
import ApplicationPreview from "../ApplicationPreview/ApplicationPreview";

type ApplicationCardProps = {
  data: ApplicationDto;
  expandedCard: ApplicationDto | null;
  setExpandedCard: React.Dispatch<React.SetStateAction<ApplicationDto | null>>;
  editApplication: () => void;
};

const ApplicationCard = ({
  data,
  expandedCard,
  setExpandedCard,
  editApplication,
}: ApplicationCardProps) => {
  const { id, jobTitle, company, favorited, status, logItems } = data;
  const { name, logoUrl } = company;

  const cardRef = useRef<HTMLDivElement>(null);
  const isActive = id === expandedCard?.id;
  const prevActiveRef = useRef(isActive);
  const { isMd } = useBreakpoint();

  const dayInfo = useMemo(() => {
    return calculateDays(logItems);
  }, [logItems]);

  useEffect(() => {
    // Only scroll when transitioning from collapsed to expanded
    if (isActive && !prevActiveRef.current && cardRef.current && !isMd) {
      cardRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

  function handleToggleExpand() {
    setExpandedCard(isActive ? (isMd ? data : null) : data);
  }

  return (
    <div id={`card-${id}`} ref={cardRef} className="application-card">
      <Card
        onClick={handleToggleExpand}
        style={{
          cursor: "pointer",
          border: `2px solid ${isActive ? "aquamarine" : "transparent"}`,
        }}
      >
        <NewBadge date={data.createdAt} />
        <Flex align={"center"} justify={"between"} gap={"2"}>
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Flex align={"center"} gap={"3"}>
              {favorited ? (
                <StarFilledIcon width="16" height="16" />
              ) : (
                <StarIcon width="16" height="16" />
              )}
              <Avatar size={"4"} src={logoUrl} fallback={name.charAt(0)} />
              <Box style={{ minWidth: 0, overflow: "hidden" }}>
                <Text as="div" weight={"bold"} truncate>
                  {name}
                </Text>
                <Text truncate as="div">
                  {jobTitle}
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box style={{ textAlign: "right", flexShrink: 0 }}>
            <Badge size={"2"}>{status}</Badge>
            <Text as="div">
              {dayInfo ? dayInfo : <StopwatchIcon width={"28"} height={"16"} />}
            </Text>
          </Box>
        </Flex>
      </Card>
      {isActive && !isMd && (
        <ApplicationPreview data={data} editApplication={editApplication} />
      )}
    </div>
  );
};

export default ApplicationCard;
