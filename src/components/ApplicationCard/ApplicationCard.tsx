import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Link,
  Text,
} from "@radix-ui/themes";
import "./ApplicationCard.scss";
import {
  Pencil2Icon,
  StarFilledIcon,
  StarIcon,
  StopwatchIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useToggleFavorite } from "../../hooks/application/useUpdateApplication";
import {
  calculateDays,
  formatDateUs,
  getPriorityLabel,
} from "../../utils/helper";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useDeleteApplication } from "../../hooks/application/useDeleteApplication";
import StatusModal from "../StatusModal/StatusModal";
import { ApplicationDto } from "../../types/dtos/application/application.dto";
import { LogItemDto } from "../../types/dtos/log-item/log-item.dto";
import { useBreakpoint } from "../../hooks/useBreakpoint";

type ApplicationCardProps = {
  data: ApplicationDto;
  expandedCardId: string | null;
  setExpandedCardId: React.Dispatch<React.SetStateAction<string | null>>;
  editApplication: () => void;
  positionIndex: number;
};

const ApplicationCard = ({
  data,
  expandedCardId,
  setExpandedCardId,
  editApplication,
  positionIndex,
}: ApplicationCardProps) => {
  const {
    id,
    jobTitle,
    company,
    jobLink,
    jobDescription,
    workLocation,
    priority,
    notes,
    favorited,
    status,
    logItems,
  } = data;
  const {
    name,
    website,
    street,
    city,
    state,
    zipCode,
    country,
    industry,
    companySize,
    contactName,
    contactEmail,
    contactPhone,
    logoUrl,
    notes: companyNotes,
  } = company;

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const toggleFavorite = useToggleFavorite();
  const deleteApplication = useDeleteApplication();
  const cardRef = useRef<HTMLDivElement>(null);
  const isActive = id === expandedCardId;
  const prevActiveRef = useRef(isActive);
  const priorityBadgeColor =
    priority === 3 ? "yellow" : priority === 2 ? "orange" : "crimson";
  const { isSm } = useBreakpoint();

  const dayInfo = useMemo(() => {
    return calculateDays(logItems);
  }, [logItems]);

  useEffect(() => {
    // Only scroll when transitioning from collapsed to expanded
    if (isActive && !prevActiveRef.current && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

  function getJobUrl() {
    if (!jobLink) return;

    const url: string = jobLink;
    return url.startsWith("http") ? url : `https://${url}`;
  }

  async function handleDeleteApplication() {
    try {
      await deleteApplication.mutateAsync(id);
    } catch (error: unknown) {
      console.error("Delete application error:", error);
    }
  }

  async function handleToggleFavorite() {
    try {
      await toggleFavorite.mutateAsync(data.id);
    } catch (error: unknown) {
      console.error("Toggle favorite error:", error);
    }
  }

  function handleToggleExpand() {
    setExpandedCardId(isActive ? null : id);
  }

  return (
    <div id={`card-${id}`} ref={cardRef} className="application-card">
      <Card onClick={handleToggleExpand} style={{ cursor: "pointer" }}>
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
      {isActive && (
        <div className="expanded-container">
          <Card>
            <Flex justify={"between"} align={"center"}>
              <Button
                style={{ cursor: "pointer" }}
                size={isSm ? "4" : "3"}
                radius={"small"}
                onClick={() => setShowStatusModal(true)}
              >
                <Text>Update Status</Text>
              </Button>
              <Flex gap={"3"}>
                <IconButton
                  style={{ cursor: "pointer" }}
                  onClick={handleToggleFavorite}
                  size={"4"}
                  radius="small"
                  color={"yellow"}
                >
                  {favorited ? (
                    <StarFilledIcon width="24" height="24" />
                  ) : (
                    <StarIcon width="24" height="24" />
                  )}
                </IconButton>
                <IconButton
                  style={{ cursor: "pointer" }}
                  onClick={editApplication}
                  size={"4"}
                  radius="small"
                >
                  <Pencil2Icon width="24" height="24" />
                </IconButton>
                <IconButton
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirmationModal(true)}
                  size={"4"}
                  radius="small"
                  color="red"
                >
                  <TrashIcon width="24" height="24" />
                </IconButton>
              </Flex>
            </Flex>
            <Flex direction={"column"} gap={"5"}>
              <Box height={"3rem"}>
                <Flex gap={"2"} height={"100%"} align={"center"}>
                  <Badge size={"3"} color={priorityBadgeColor}>
                    <Text size={"3"}>
                      Priority: {getPriorityLabel(priority)}
                    </Text>
                  </Badge>
                  <Badge size={"3"} color="cyan">
                    <Text size={"3"}>Type: {workLocation}</Text>
                  </Badge>
                </Flex>
              </Box>
              {jobLink && (
                <Box
                  style={{ minWidth: 0, overflow: "hidden" }}
                  height={"3rem"}
                >
                  <Flex height={"100%"} align={"center"}>
                    <Link
                      href={getJobUrl()}
                      size={"5"}
                      underline="always"
                      weight={"bold"}
                      title={jobLink}
                      color="indigo"
                      target="_blank"
                      rel="noreferrer"
                      truncate
                    >
                      <Text as="div" truncate>
                        {jobLink}
                      </Text>
                    </Link>
                  </Flex>
                </Box>
              )}
              {jobDescription && (
                <Flex direction={"column"}>
                  <Text weight={"medium"}>Description:</Text>
                  <Text>{jobDescription}</Text>
                </Flex>
              )}
              {notes && (
                <Flex direction={"column"}>
                  <Text weight={"medium"}>Job Notes: </Text>
                  <Text>{notes}</Text>
                </Flex>
              )}
              <Card>
                <Flex direction={"column"} gap={"3"}>
                  <Text weight={"bold"} size={"6"}>
                    {name}
                  </Text>
                  {website && (
                    <Box
                      style={{ minWidth: 0, overflow: "hidden" }}
                      height={"2rem"}
                    >
                      <Flex height={"100%"} align={"center"}>
                        <Link
                          href={website}
                          underline="always"
                          weight={"bold"}
                          title={website}
                          color="indigo"
                          target="_blank"
                          rel="noreferrer"
                          truncate
                        >
                          <Text as="div" truncate>
                            {website}
                          </Text>
                        </Link>
                      </Flex>
                    </Box>
                  )}
                  {(street || zipCode || city || state || country) && (
                    <Flex direction="column">
                      <Text weight={"medium"}>Address:</Text>
                      {street && <Text>{street}</Text>}
                      {(zipCode || city) && (
                        <Text>
                          {zipCode && `${zipCode} `}
                          {city}
                        </Text>
                      )}
                      {(state || country) && (
                        <Text>
                          {state && `${state} `}
                          {country}
                        </Text>
                      )}
                    </Flex>
                  )}
                  {industry && (
                    <Flex gap={"3"}>
                      <Text weight={"medium"}>Industry:</Text>
                      <Text>{industry}</Text>
                    </Flex>
                  )}
                  {companySize && (
                    <Flex gap={"3"}>
                      <Text weight={"medium"}>Company Size:</Text>
                      <Text>{companySize} employees</Text>
                    </Flex>
                  )}
                  {(contactName || contactEmail || contactPhone) && (
                    <Flex direction={"column"}>
                      <Text weight={"medium"}>Contact:</Text>
                      <Badge size={"3"}>
                        <Flex direction={"column"}>
                          {contactName && <Text size={"3"}>{contactName}</Text>}
                          {contactEmail && (
                            <Text size={"3"}>{contactEmail}</Text>
                          )}
                          {contactPhone && (
                            <Text size={"3"}>{contactPhone}</Text>
                          )}
                        </Flex>
                      </Badge>
                    </Flex>
                  )}
                  {companyNotes && (
                    <Flex direction={"column"}>
                      <Text weight={"medium"}>Company Notes:</Text>
                      <Text>{companyNotes}</Text>
                    </Flex>
                  )}
                </Flex>
              </Card>
              <Flex direction={"column"} gap={"2"}>
                <Text weight={"medium"}>History:</Text>
                {logItems
                  .slice()
                  .reverse()
                  .map((logItem: LogItemDto) => {
                    return (
                      <Card key={logItem.id}>
                        <Flex gap={"3"} align={"center"} justify={"between"}>
                          <Text>{formatDateUs(new Date(logItem.date!))}</Text>
                          <Badge size={"3"}>
                            <Text>{logItem.status}</Text>
                          </Badge>
                        </Flex>
                      </Card>
                    );
                  })}
              </Flex>
            </Flex>
          </Card>
        </div>
      )}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirmation={handleDeleteApplication}
        onAbortion={() => setShowConfirmationModal(false)}
      />
      <StatusModal
        applicationId={id}
        isOpen={showStatusModal}
        logItems={logItems}
        onClose={() => setShowStatusModal(false)}
      />
    </div>
  );
};

export default ApplicationCard;
