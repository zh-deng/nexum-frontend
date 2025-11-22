import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import { InterviewDto } from "../../types/dtos/interview/interview.dto";
import "./InterviewCard.scss";
import { formatDateUs, getLocalDatetimeValue } from "../../utils/helper";
import { ClockIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useState } from "react";
import FloatingTextField from "../FloatingTextField/FloatingTextField";
import FloatingTextArea from "../FloatingTextArea/FloatingTextArea";
import { useUpdateInterview } from "../../hooks/interview/useUpdateInterview";
import { useDeleteInterview } from "../../hooks/interview/useDeleteInterview";
import { useCreateReminder } from "../../hooks/reminder/useCreateReminder";
import NewBadge from "../NewBadge/NewBadge";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useRouter } from "next/navigation";
import { useToast } from "../ToastProvider/ToastProvider";

// Interview form for updating and deleting
type InterviewFormContainerProps = {
  form: InterviewForm;
  setForm: React.Dispatch<React.SetStateAction<InterviewForm>>;
};

const InterviewFormContainer = ({
  form,
  setForm,
}: InterviewFormContainerProps) => {
  const [initialSnapshot] = useState<InterviewForm>(form);
  const updateInterview = useUpdateInterview();
  const toast = useToast();

  function handleChange(
    input:
      | React.ChangeEvent<HTMLInputElement>
      | { name: string; value: string },
  ) {
    if ("target" in input) {
      const { name, value } = input.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      const { name, value } = input;
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleUpdateInterview() {
    const hasChanged =
      form.date !== initialSnapshot.date ||
      form.notes.trim() !== initialSnapshot.notes.trim();

    if (!hasChanged) return;

    try {
      const { id, date, ...rest } = form;

      if (typeof id !== "string") return;

      await updateInterview.mutateAsync({
        id,
        data: {
          date: new Date(date).toISOString(),
          ...rest,
        },
      });

      toast.success("Successfully updated interview");
    } catch (error: unknown) {
      console.error("Update interview error:", error);
      toast.error("Failed to update interview");
    }
  }

  function handleClose() {
    setForm(initialSnapshot);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton size={"3"} radius={"small"} style={{ cursor: "pointer" }}>
          <Pencil2Icon width={24} height={24} />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="300px">
        <Dialog.Title>Edit interview</Dialog.Title>
        <Flex direction="column" gap="3">
          <Box width={"180px"}>
            <Text as="div" size="2" mb="1" weight="bold">
              Date
            </Text>
            <FloatingTextField
              placeholder="Date"
              type="datetime-local"
              isFloating={false}
              value={getLocalDatetimeValue(form.date)}
              onChange={(value) =>
                handleChange({ name: "date", value: value.target.value })
              }
            />
          </Box>

          <Box>
            <Text as="div" size="2" mb="1" weight="bold">
              Notes
            </Text>
            <FloatingTextArea
              placeholder="Notes"
              value={form.notes}
              isFloating={false}
              size={"3"}
              onChange={(value) =>
                handleChange({ name: "notes", value: value.target.value })
              }
            />
          </Box>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={handleClose}>
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleUpdateInterview}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

type ReminderFormContainerProps = {
  applicationId: string;
};

// Reminder form for creating
type ReminderForm = {
  alarmDate: string;
  message: string;
};

const ReminderFormContainer = ({
  applicationId,
}: ReminderFormContainerProps) => {
  const intialValues = {
    alarmDate: getLocalDatetimeValue(),
    message: "",
  };
  const router = useRouter();
  const [form, setForm] = useState<ReminderForm>(intialValues);
  const createReminder = useCreateReminder();
  const toast = useToast();

  function handleChange(
    input:
      | React.ChangeEvent<HTMLInputElement>
      | { name: string; value: string },
  ) {
    if ("target" in input) {
      const { name, value } = input.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      const { name, value } = input;
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleCreateReminder() {
    try {
      const { alarmDate, ...rest } = form;

      await createReminder.mutateAsync({
        applicationId,
        alarmDate: new Date(alarmDate).toISOString(),
        ...rest,
      });

      router.push("/dashboard/reminders");
      toast.success("Successfully created reminder");
    } catch (error: unknown) {
      console.error("Create reminder error:", error);
      toast.error("Failed to create reminder");
    }

    handleClose();
  }

  function handleClose() {
    setForm(intialValues);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton size={"3"} radius={"small"} style={{ cursor: "pointer" }}>
          <ClockIcon width={24} height={24} />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="300px">
        <Dialog.Title>Create Reminder</Dialog.Title>

        <Flex direction="column" gap="3">
          <Box width={"180px"}>
            <Text as="div" size="2" mb="1" weight="bold">
              Alarm Date
            </Text>
            <FloatingTextField
              placeholder="Alarm Date"
              type="datetime-local"
              isFloating={false}
              value={getLocalDatetimeValue(form.alarmDate)}
              onChange={(value) =>
                handleChange({ name: "alarmDate", value: value.target.value })
              }
            />
          </Box>

          <Box>
            <Text as="div" size="2" mb="1" weight="bold">
              Message
            </Text>
            <FloatingTextArea
              placeholder="Message"
              value={form.message}
              isFloating={false}
              size={"3"}
              onChange={(value) =>
                handleChange({ name: "message", value: value.target.value })
              }
            />
          </Box>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={handleClose}>
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleCreateReminder}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// Actual interview card
type InterviewCardProps = {
  data: InterviewDto;
};

type InterviewForm = {
  id: string | number | null;
  date: string;
  notes: string;
};

const InterviewCard = ({ data }: InterviewCardProps) => {
  const initialForm = {
    id: data.id ?? -1,
    date: data.date ?? getLocalDatetimeValue(),
    notes: data.notes ?? "",
  };

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [form, setForm] = useState<InterviewForm>(initialForm);
  const deleteInterview = useDeleteInterview();
  const toast = useToast();

  async function handleDeleteInterview() {
    try {
      deleteInterview.mutateAsync(data.id);

      toast.success("Successfully deleted interview");
    } catch (error: unknown) {
      console.error("Delete interview error:", error);
      toast.error("Failed to delete interview");
    }
  }

  return (
    <Box height={"100%"}>
      <Card asChild>
        <Box height={"100%"}>
          <NewBadge date={data.createdAt} />
          <Flex
            align={"center"}
            justify={"between"}
            gap={"2"}
            wrap={"wrap-reverse"}
          >
            <Flex align={"center"} gap={"4"}>
              <Text>{formatDateUs(new Date(data.date), true)}</Text>
              <Box width={"100px"}>
                <Badge size={"3"}>{data.status}</Badge>
              </Box>
            </Flex>
            <Flex gap={"2"} justify={"end"} width={"100%"}>
              <InterviewFormContainer form={form} setForm={setForm} />
              <ReminderFormContainer applicationId={data.applicationId} />
              <IconButton
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirmationModal(true)}
                size={"3"}
                radius="small"
                color="red"
              >
                <TrashIcon width="24" height="24" />
              </IconButton>
            </Flex>
          </Flex>
          <Flex direction={"column"}>
            <Text>{data.application.company.name}</Text>
            <Text>{data.application.jobTitle}</Text>
          </Flex>
          {data.notes && (
            <>
              <Separator size={"4"} my={"2"} />
              <Flex direction={"column"}>
                <Text weight={"medium"}>Notes: </Text>
                <Text>{data.notes}</Text>
              </Flex>
            </>
          )}
        </Box>
      </Card>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirmation={handleDeleteInterview}
        onAbortion={() => setShowConfirmationModal(false)}
      />
    </Box>
  );
};

export default InterviewCard;
