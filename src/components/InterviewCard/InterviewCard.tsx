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
import {
  convertUtcToLocalParts,
  formatDateUs,
  getTodayLocalDate,
  localDateToUtc,
  localTimeToUtc,
} from "../../utils/helper";
import { ClockIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useState } from "react";
import FloatingTextField from "../FloatingTextField/FloatingTextField";
import FloatingTextArea from "../FloatingTextArea/FloatingTextArea";
import { useUpdateInterview } from "../../hooks/interview/useUpdateInterview";
import { useDeleteInterview } from "../../hooks/interview/useDeleteInterview";

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

  const { localDate, localTime } = convertUtcToLocalParts(form.date);

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

  function handleDateChange(newDate: string) {
    setForm((prev) => {
      const [hours, minutes] = localTimeToUtc(prev.date).split(":").map(Number);
      const localDate = new Date(newDate);
      localDate.setHours(hours, minutes, 0, 0);
      return { ...prev, date: localDate.toISOString() };
    });
  }

  function handleTimeChange(newTime: string) {
    setForm((prev) => {
      const [year, month, day] = localDateToUtc(prev.date)
        .split("-")
        .map(Number);
      const [hours, minutes] = newTime.split(":").map(Number);
      const localDate = new Date(year, month - 1, day, hours, minutes);
      return { ...prev, date: localDate.toISOString() };
    });
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
          date,
          ...rest,
        },
      });
    } catch (error: unknown) {
      console.error("Create or update log item error:", error);
    }

    handleClose();
  }

  function handleClose() {
    setForm(initialSnapshot);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton size={"3"}>
          <Pencil2Icon width={24} height={24} />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="300px">
        <Dialog.Title>Edit interview</Dialog.Title>
        {form.date}
        <Flex direction="column" gap="3">
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">
              Date
            </Text>
            <Flex align={"center"} justify={"between"}>
              <FloatingTextField
                placeholder="Date"
                type="date"
                isFloating={false}
                value={localDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              <FloatingTextField
                placeholder="Time"
                type="time"
                isFloating={false}
                value={localTime}
                onChange={(e) => handleTimeChange(e.target.value)}
              />
            </Flex>
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
    date: data.date ?? getTodayLocalDate(),
    notes: data.notes ?? "",
  };

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [form, setForm] = useState<InterviewForm>(initialForm);
  const deleteInterview = useDeleteInterview();

  async function handleDeleteApplication() {
    try {
      deleteInterview.mutateAsync(data.id);
    } catch (error: unknown) {
      console.error("Delete application error:", error);
    }
  }

  return (
    <div>
      <Card>
        <Flex
          align={"center"}
          justify={"between"}
          gap={"2"}
          wrap={"wrap-reverse"}
        >
          <Flex align={"center"} gap={"4"}>
            <Text>{formatDateUs(new Date(data.date), true)}</Text>
            <Badge size={"3"}>{data.status}</Badge>
          </Flex>
          <Flex gap={"2"}>
            <InterviewFormContainer form={form} setForm={setForm} />
            <IconButton size={"3"}>
              <ClockIcon width={24} height={24} />
            </IconButton>
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
      </Card>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirmation={handleDeleteApplication}
        onAbortion={() => setShowConfirmationModal(false)}
      />
    </div>
  );
};

export default InterviewCard;
