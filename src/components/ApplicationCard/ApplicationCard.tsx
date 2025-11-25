"use client";

import { Avatar, Badge, Box, Card, Flex, Text } from "@radix-ui/themes";
import "./ApplicationCard.scss";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
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
  const isActive = id === expandedCard?.id;

  const cardRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef(isActive);

  const { isMd } = useBreakpoint();

  const { additionalInfo, latestLogSince } = useMemo(
    () => calculateDays(logItems),
    [logItems],
  );

  useEffect(() => {
    // Only scroll when transitioning from collapsed to expanded
    if (isActive && !prevActiveRef.current && cardRef.current && !isMd) {
      cardRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

  function handleToggleExpand() {
    if (!isActive) {
      setExpandedCard(data);
      return;
    }

    if (!isMd) {
      setExpandedCard(null);
    }
  }

  return (
    <div ref={cardRef} className="application-card">
      <Card
        onClick={handleToggleExpand}
        className={isActive ? "card active" : "card"}
      >
        <NewBadge date={data.createdAt} />
        <Flex align={"center"} justify={"between"} gap={"2"}>
          <Box className="application-card-company">
            <Flex align={"center"} gap={"3"}>
              {favorited ? (
                <StarFilledIcon width={"16"} height={"16"} />
              ) : (
                <StarIcon width={"16"} height={"16"} />
              )}
              <Avatar size={"4"} src={logoUrl} fallback={name.charAt(0)} />
              <Box style={{ minWidth: 0, overflow: "hidden" }}>
                <Text as={"div"} weight={"bold"} truncate>
                  {name}
                </Text>
                <Text truncate as={"div"}>
                  {jobTitle}
                </Text>
              </Box>
            </Flex>
          </Box>
          <Flex
            direction={"column"}
            gap={"2"}
            style={{ textAlign: "right", flexShrink: 0 }}
          >
            <Badge size={"2"}>{`${status} ${latestLogSince}`}</Badge>
            {additionalInfo && (
              <Badge size={"2"} color={"gray"}>
                {additionalInfo}
              </Badge>
            )}
          </Flex>
        </Flex>
      </Card>
      {isActive && !isMd && (
        <ApplicationPreview data={data} editApplication={editApplication} />
      )}
    </div>
  );
};

export default ApplicationCard;
