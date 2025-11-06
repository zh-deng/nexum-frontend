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
import { formatDateUs } from "../../utils/helper";
import { ClockIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useState } from "react";
import FloatingTextField from "../FloatingTextField/FloatingTextField";
import Dropdown from "../Dropdown/Dropdown";
import FloatingTextArea from "../FloatingTextArea/FloatingTextArea";

type InterviewFormContainerProps = {
  form: InterviewForm;
  setForm: React.Dispatch<React.SetStateAction<InterviewForm>>;
};

const InterviewFormContainer = ({
  form,
  setForm,
}: InterviewFormContainerProps) => {
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
            <FloatingTextField placeholder="Date" type="date" />
          </Box>
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">
              Status
            </Text>
            <Dropdown
              name={"Test"}
              options={[]}
              onChange={function (value: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </Box>
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">
              Notes
            </Text>
            <FloatingTextArea placeholder="Notes" />
          </Box>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
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
  status: string;
  date: string;
  notes: string;
};

const InterviewCard = ({ data }: InterviewCardProps) => {
  const initialForm = {
    id: null,
    status: "",
    date: "",
    notes: "",
  };

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [form, setForm] = useState<InterviewForm>(initialForm);

  async function handleDeleteApplication() {
    try {
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
            <Badge>{data.status}</Badge>
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
