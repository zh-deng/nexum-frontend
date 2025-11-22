"use client";

import "./ApplicationPreview.scss";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Link,
  Text,
} from "@radix-ui/themes";
import { formatDateUs, getPriorityLabel } from "../../utils/helper";
import { LogItemDto } from "../../types/dtos/log-item/log-item.dto";
import {
  Pencil2Icon,
  StarFilledIcon,
  StarIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import StatusModal from "../StatusModal/StatusModal";
import { ApplicationDto } from "../../types/dtos/application/application.dto";
import { useState } from "react";
import { useToggleFavorite } from "../../hooks/application/useUpdateApplication";
import { useDeleteApplication } from "../../hooks/application/useDeleteApplication";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useToast } from "../ToastProvider/ToastProvider";

// Helper component to display a label and its corresponding value
const LabelValue = ({
  label,
  value,
  column = false,
  gap = "3",
}: {
  label: string;
  value: string | undefined;
  column?: boolean;
  gap?: string;
}) =>
  value && (
    <>
      <Flex direction={column ? "column" : "row"} gap={gap}>
        <Text weight="medium">{label}:</Text>
        <Text>{value}</Text>
      </Flex>
    </>
  );

type ApplicationPreviewProps = {
  data: ApplicationDto;
  editApplication: () => void;
};

const ApplicationPreview = ({
  data,
  editApplication,
}: ApplicationPreviewProps) => {
  const {
    id,
    company,
    jobLink,
    jobDescription,
    workLocation,
    priority,
    notes,
    favorited,
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
  const formattedCity =
    zipCode || city ? `${zipCode ?? ""} ${city ?? ""}` : null;
  const formattedRegion =
    state || country ? `${state ?? ""} ${country ?? ""}` : null;

  const priorityBadgeColor =
    priority === 3 ? "yellow" : priority === 2 ? "orange" : "crimson";

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  const toggleFavorite = useToggleFavorite();
  const deleteApplication = useDeleteApplication();
  const { isSm, isMd } = useBreakpoint();
  const toast = useToast();

  const buttonSize = isMd ? "3" : isSm ? "4" : "3";

  function getJobUrl() {
    if (!jobLink) return;

    const url: string = jobLink;
    return url.startsWith("http") ? url : `https://${url}`;
  }

  async function handleDeleteApplication() {
    try {
      await deleteApplication.mutateAsync(id);
      toast.success("Successfully deleted application");
    } catch (error: unknown) {
      console.error("Delete application error:", error);
      toast.error("Failed to delete application");
    }
  }

  async function handleToggleFavorite() {
    try {
      await toggleFavorite.mutateAsync(data.id);
      toast.success("Changed favorite");
    } catch (error: unknown) {
      console.error("Toggle favorite error:", error);
      toast.error("Failed to change favorite");
    }
  }

  return (
    <>
      <Card>
        <Box
          maxHeight={isMd ? "65vh" : ""}
          overflowY={isMd ? "auto" : "visible"}
        >
          <Flex justify={"between"} align={"center"}>
            <Button
              style={{ cursor: "pointer" }}
              size={buttonSize}
              radius={"small"}
              onClick={() => setShowStatusModal(true)}
            >
              <Text>Update Status</Text>
            </Button>
            <Flex gap={"3"}>
              <IconButton
                style={{ cursor: "pointer" }}
                onClick={handleToggleFavorite}
                size={buttonSize}
                radius="small"
                color={"yellow"}
              >
                {favorited ? (
                  <StarFilledIcon width={"24"} height={"24"} />
                ) : (
                  <StarIcon width={"24"} height={"24"} />
                )}
              </IconButton>
              <IconButton
                style={{ cursor: "pointer" }}
                onClick={editApplication}
                size={buttonSize}
                radius={"small"}
              >
                <Pencil2Icon width={"24"} height={"24"} />
              </IconButton>
              <IconButton
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirmationModal(true)}
                size={buttonSize}
                radius={"small"}
                color={"red"}
              >
                <TrashIcon width={"24"} height={"24"} />
              </IconButton>
            </Flex>
          </Flex>
          <Flex direction={"column"} gap={"5"}>
            <Box height={"3rem"}>
              <Flex gap={"2"} height={"100%"} align={"center"}>
                <Badge size={"3"} color={priorityBadgeColor}>
                  <Text size={"3"}>Priority: {getPriorityLabel(priority)}</Text>
                </Badge>
                <Badge size={"3"} color="cyan">
                  <Text size={"3"}>Type: {workLocation}</Text>
                </Badge>
              </Flex>
            </Box>
            {jobLink && (
              <Box style={{ minWidth: 0, overflow: "hidden" }} height={"3rem"}>
                <Flex height={"100%"} align={"center"}>
                  <Link
                    href={getJobUrl()}
                    size={"5"}
                    underline="always"
                    weight={"bold"}
                    title={jobLink}
                    color={"indigo"}
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    truncate
                  >
                    <Text as={"div"} truncate>
                      {jobLink}
                    </Text>
                  </Link>
                </Flex>
              </Box>
            )}
            <LabelValue
              label="Description"
              value={jobDescription}
              column={true}
            />
            <LabelValue label="Notes" value={notes} column={true} />
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
                        underline={"always"}
                        weight={"bold"}
                        title={website}
                        color={"indigo"}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                        truncate
                      >
                        <Text as={"div"} truncate>
                          {website}
                        </Text>
                      </Link>
                    </Flex>
                  </Box>
                )}
                {(street || zipCode || city || state || country) && (
                  <Flex direction={"column"}>
                    <Text weight={"medium"}>Address:</Text>
                    {street && <Text>{street}</Text>}
                    {formattedCity && <Text>{formattedCity}</Text>}
                    {formattedRegion && <Text>{formattedRegion}</Text>}
                  </Flex>
                )}
                <LabelValue label={"Industry"} value={industry} gap={"3"} />
                <LabelValue
                  label={"Company Size"}
                  value={companySize}
                  gap={"3"}
                />
                {(contactName || contactEmail || contactPhone) && (
                  <Flex direction={"column"}>
                    <Text weight={"medium"}>Contact:</Text>
                    <Badge size={"3"}>
                      <Flex direction={"column"}>
                        {contactName && <Text size={"3"}>{contactName}</Text>}
                        {contactEmail && <Text size={"3"}>{contactEmail}</Text>}
                        {contactPhone && <Text size={"3"}>{contactPhone}</Text>}
                      </Flex>
                    </Badge>
                  </Flex>
                )}
                <LabelValue
                  label={"Company Notes"}
                  value={companyNotes}
                  column={true}
                />
              </Flex>
            </Card>
            <Flex direction={"column"} gap={"2"}>
              <Text weight={"medium"}>History:</Text>
              {logItems.map((logItem: LogItemDto) => {
                return (
                  <Card key={logItem.id}>
                    <Flex gap={"3"} align={"center"} justify={"between"}>
                      <Text>{formatDateUs(new Date(logItem.date!), true)}</Text>
                      <Badge size={"3"}>
                        <Text>{logItem.status}</Text>
                      </Badge>
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          </Flex>
        </Box>
      </Card>
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
    </>
  );
};

export default ApplicationPreview;
