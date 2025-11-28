import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Separator,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { ReminderDto } from "../../types/dtos/reminder/reminder.dto";
import "./ReminderCard.scss";
import { formatDateUs, getLocalDatetimeValue } from "../../utils/helper";
import { Pencil2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useDeleteReminder } from "../../hooks/reminder/useDeleteReminder";
import FloatingTextArea from "../FloatingTextArea/FloatingTextArea";
import FloatingTextField from "../FloatingTextField/FloatingTextField";
import Dropdown from "../Dropdown/Dropdown";
import { ReminderStatus } from "../../types/enums";
import { useUpdateReminder } from "../../hooks/reminder/useUpdateReminder";
import NewBadge from "../NewBadge/NewBadge";
import { useToast } from "../ToastProvider/ToastProvider";

type ReminderFormContainerProps = {
  type?: "Create" | "Update";
  applicationId?: string;
  data?: ReminderForm & { id: string };
};

// Reminder form for creating
type ReminderForm = {
  alarmDate: string;
  status: ReminderStatus;
  message: string;
};

export const ReminderFormContainer = ({
  type = "Update",
  data,
}: ReminderFormContainerProps) => {
  const intialValues = {
    alarmDate: data?.alarmDate ?? getLocalDatetimeValue(),
    status: data?.status ?? ReminderStatus.STOPPED,
    message: data?.message ?? "",
  };

  const [form, setForm] = useState<ReminderForm>(intialValues);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const statusOptions = Object.values(ReminderStatus).filter(
    (elem) => elem !== form.status,
  );

  const toast = useToast();
  const updateReminder = useUpdateReminder();

  function handleChange(
    input:
      | React.ChangeEvent<HTMLInputElement>
      | { name: string; value: string },
  ) {
    setError("");
    if ("target" in input) {
      const { name, value } = input.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      const { name, value } = input;
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleCreateOrUpdateReminder() {
    const currentDateTime = new Date(Date.now()).toISOString();
    const submitAlarmDate = new Date(form.alarmDate).toISOString();
    const isFuture = submitAlarmDate > currentDateTime;

    setError("");

    // Validation rules:
    if (
      (form.status === ReminderStatus.ACTIVE ||
        form.status === ReminderStatus.STOPPED) &&
      !isFuture
    ) {
      setError("Date must be in the future for this status.");
      return;
    }

    if (form.status === ReminderStatus.DONE && isFuture) {
      setError("Date must be in the past for this status.");
      return;
    }

    setIsUpdating(true);
    try {
      const { alarmDate, ...rest } = form;

      if (data?.id) {
        await updateReminder.mutateAsync({
          id: data.id,
          data: {
            alarmDate: submitAlarmDate,
            ...rest,
          },
        });

        toast.success("Successfully updated reminder");
      }
    } catch (error: unknown) {
      console.error("Create reminder error:", error);
      toast.error("Failed to update reminder");
    } finally {
      setIsUpdating(false);
    }

    setIsOpen(false);
  }

  function handleClose() {
    setForm(intialValues);
    setError("");
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {type === "Create" ? (
        <div className="trigger-icon">
          <Dialog.Trigger>
            <IconButton
              size={"4"}
              variant={"surface"}
              radius={"small"}
              style={{ cursor: "pointer" }}
            >
              <PlusIcon width={32} height={32} />
            </IconButton>
          </Dialog.Trigger>
        </div>
      ) : (
        <Dialog.Trigger>
          <IconButton size={"3"} radius={"small"} style={{ cursor: "pointer" }}>
            <Pencil2Icon width={24} height={24} />
          </IconButton>
        </Dialog.Trigger>
      )}
      <Dialog.Content maxWidth="300px">
        {type === "Create" ? (
          <Dialog.Title>Create Reminder</Dialog.Title>
        ) : (
          <Dialog.Title>Edit Reminder</Dialog.Title>
        )}

        <Flex direction={"column"} gap={"3"}>
          <Box width={"180px"}>
            <Text as={"div"} size={"2"} mb={"1"} weight={"bold"}>
              Alarm Date
            </Text>
            <FloatingTextField
              placeholder={"Date"}
              type={"datetime-local"}
              isFloating={false}
              value={getLocalDatetimeValue(form.alarmDate)}
              onChange={(value) =>
                handleChange({ name: "alarmDate", value: value.target.value })
              }
            />
          </Box>
          <Box>
            <Text as={"div"} size={"2"} mb={"1"} weight={"bold"}>
              Status
            </Text>
            <Dropdown
              name={form.status}
              options={statusOptions}
              onChange={(value) =>
                handleChange({ name: "status", value: value })
              }
            />
            {error && (
              <Text color={"red"} size={"2"} mt={"1"}>
                {error}
              </Text>
            )}
          </Box>
          <Box>
            <Text as={"div"} size={"2"} mb={"1"} weight={"bold"}>
              Message
            </Text>
            <FloatingTextArea
              placeholder={"Message"}
              value={form.message}
              isFloating={false}
              size={"3"}
              onChange={(value) =>
                handleChange({ name: "message", value: value.target.value })
              }
            />
          </Box>
        </Flex>
        <Flex gap={"3"} mt={"4"} justify={"end"}>
          <Dialog.Close>
            <Button
              variant={"soft"}
              color={"gray"}
              onClick={handleClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleCreateOrUpdateReminder} disabled={isUpdating}>
            {isUpdating ? <Spinner size="2" /> : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

type ReminderCardProps = {
  data: ReminderDto;
};

const ReminderCard = ({ data }: ReminderCardProps) => {
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteReminder = useDeleteReminder();
  const toast = useToast();

  async function handleDeleteReminder() {
    setIsDeleting(true);
    try {
      await deleteReminder.mutateAsync(data.id);

      toast.success("Successfully deleted reminder");
    } catch (error: unknown) {
      console.error("Delete reminder error:", error);
      toast.error("Failed to delete reminder");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <Card>
        <NewBadge date={data.createdAt} />
        <Flex direction={"column"}>
          <Flex
            align={"center"}
            gap={"4"}
            justify={"between"}
            wrap={"wrap-reverse"}
          >
            <Flex align={"center"} gap={"4"}>
              <Text weight={"medium"}>
                {formatDateUs(new Date(data.alarmDate), true)}
              </Text>
              <Badge size={"3"}>{data.status}</Badge>
            </Flex>
            <Flex gap={"2"} justify={"end"} width={"100%"}>
              <ReminderFormContainer
                applicationId={data.applicationId}
                data={{
                  id: data.id,
                  alarmDate: data.alarmDate,
                  status: data.status,
                  message: data.message,
                }}
              />
              <IconButton
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirmationModal(true)}
                size={"3"}
                radius={"small"}
                color={"red"}
              >
                <TrashIcon width={"24"} height={"24"} />
              </IconButton>
            </Flex>
          </Flex>
          <Text weight={"bold"} size={"5"}>
            {data.application.company.name}
          </Text>
          <Text>{data.application.jobTitle}</Text>
          {data.message && (
            <>
              <Separator size={"4"} my={"2"} />
              <Text weight={"medium"}>Message:</Text>
              <Text>{data.message}</Text>
            </>
          )}
        </Flex>
      </Card>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirmation={handleDeleteReminder}
        onAbortion={() => setShowConfirmationModal(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ReminderCard;
