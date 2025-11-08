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
import { formatDateUs, getTodayLocalDate } from "../../utils/helper";
import { ClockIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useState } from "react";
import FloatingTextField from "../FloatingTextField/FloatingTextField";
import FloatingTextArea from "../FloatingTextArea/FloatingTextArea";
import { InterviewStatus } from "../../types/enums";
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
  const fullDate = new Date(form.date).toISOString();
  const updateInterview = useUpdateInterview();

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
      form.date.slice(0, 10) !== initialSnapshot.date.slice(0, 10) ||
      form.notes.trim() !== initialSnapshot.notes.trim();

    if (!hasChanged) return;

    try {
      const { id, date, ...rest } = form;

      if (typeof id !== "string") return;

      const transferDate =
        fullDate.split("T")[0] === new Date(date).toISOString().split("T")[0]
          ? fullDate
          : new Date(date).toISOString();

      await updateInterview.mutateAsync({
        id,
        data: {
          date: transferDate,
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

        <Flex direction="column" gap="3">
          <Box width={"150px"}>
            <Text as="div" size="2" mb="1" weight="bold">
              Date
            </Text>
            <FloatingTextField
              placeholder="Date"
              type="date"
              isFloating={false}
              value={form.date ? form.date.slice(0, 10) : ""}
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
