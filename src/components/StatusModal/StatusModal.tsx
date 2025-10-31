import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import "./StatusModal.scss";
import {
  combineDateWithTime,
  formatDateUs,
  getStatusOptions,
  getTodayLocalDate,
} from "../../utils/helper";
import {
  CheckIcon,
  Cross1Icon,
  Pencil2Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import FloatingTextField from "../FloatingTextField/FloatingTextField";
import { useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import FloatingTextArea from "../FloatingTextArea/FloatingTextArea";
import { useCreateLogItem } from "../../hooks/log-item/useCreateLogItem";
import { useUpdateLogItem } from "../../hooks/log-item/useUpdateLogItem";
import { LogItemDto } from "../../types/dtos/log-item/log-item.dto";
import { useDeleteLogItem } from "../../hooks/log-item/useDeleteLogItem";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { ApplicationStatus } from "../../types/enums";

type StatusInputContainerProps = {
  applicationId: string;
  statusOptions: ApplicationStatus[];
  form: LogItemForm;
  setForm: React.Dispatch<React.SetStateAction<LogItemForm>>;
};

const StatusInputContainer = ({
  applicationId,
  statusOptions,
  form,
  setForm,
}: StatusInputContainerProps) => {
  const options = statusOptions.filter((elem) => elem !== form.status);
  const fullDate = new Date(form.date).toISOString();

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [statusError, setStatusError] = useState<string>("");

  const createLogItem = useCreateLogItem();
  const updateLogItem = useUpdateLogItem();
  const deleteLogItem = useDeleteLogItem();

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

      if (name === "status" && value) {
        setStatusError("");
      }
    }
  }

  function resetId() {
    setForm({ id: null, status: "", date: "", notes: "" });
    setStatusError("");
  }

  async function createOrUpdateLogItem() {
    // Validate status before submitting
    if (!form.status) {
      setStatusError("Please select a status");
      return;
    }

    try {
      const { id, date, ...rest } = form;

      if (form.id === -1) {
        const fullTimestamp = date
          ? combineDateWithTime(date)
          : new Date().toISOString();

        await createLogItem.mutateAsync({
          applicationId: applicationId,
          date: fullTimestamp,
          ...rest,
        });
      } else {
        if (typeof id !== "string") return;

        const transferDate =
          fullDate.split("T")[0] === new Date(date).toISOString().split("T")[0]
            ? fullDate
            : new Date(date).toISOString();

        await updateLogItem.mutateAsync({
          id,
          data: {
            date: transferDate,
            ...rest,
          },
        });
      }
    } catch (error: unknown) {
      console.error("Create or update log item error:", error);
    }

    resetId();
  }

  async function handleDeleteLogItem() {
    try {
      if (typeof form.id !== "string") return;

      await deleteLogItem.mutateAsync(form.id);
    } catch (error: unknown) {
      console.error("Delete log item error:", error);
    }
  }

  return (
    <Card>
      <Flex direction={"column"} gap={"4"}>
        <Flex justify={"between"}>
          <FloatingTextField
            type={"date"}
            placeholder="Action Date"
            value={form.date ? form.date.slice(0, 10) : ""}
            onChange={(value) =>
              handleChange({ name: "date", value: value.target.value })
            }
          />
          <Dropdown
            width="50%"
            name={form.status || "Status"}
            options={options}
            onChange={(value) => handleChange({ name: "status", value: value })}
          />
        </Flex>
        <FloatingTextArea
          placeholder="Notes"
          size={"3"}
          value={form.notes}
          onChange={(value) =>
            handleChange({ name: "notes", value: value.target.value })
          }
        />
        {statusError && (
          <Text size="2" color="red">
            {statusError}
          </Text>
        )}
        <Flex justify={"between"}>
          <Flex gap={"4"}>
            <IconButton
              size={"3"}
              radius={"small"}
              onClick={createOrUpdateLogItem}
            >
              <CheckIcon width={"24"} height={"24"} />
            </IconButton>
            <IconButton
              size={"3"}
              radius={"small"}
              color={"crimson"}
              onClick={resetId}
            >
              <Cross1Icon width={"24"} height={"24"} />
            </IconButton>
          </Flex>
          {form.id !== -1 && form.status !== ApplicationStatus.DRAFT && (
            <IconButton
              size={"3"}
              radius={"small"}
              color={"red"}
              onClick={() => setShowConfirmationModal(true)}
            >
              <TrashIcon width={"24"} height={"24"} />
            </IconButton>
          )}
        </Flex>
      </Flex>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirmation={handleDeleteLogItem}
        onAbortion={() => setShowConfirmationModal(false)}
      />
    </Card>
  );
};

type StatusModalProps = {
  applicationId: string;
  isOpen: boolean;
  logItems: LogItemDto[];
  onClose: () => void;
};

type LogItemForm = {
  id: string | number | null;
  status: string;
  date: string;
  notes: string;
};

const StatusModal = ({
  applicationId,
  isOpen,
  logItems,
  onClose,
}: StatusModalProps) => {
  const initialForm = {
    id: null,
    status: "",
    date: "",
    notes: "",
  };

  const statusOptions = getStatusOptions(logItems);
  const [form, setForm] = useState<LogItemForm>(initialForm);

  function openStatusForm(logItem?: LogItemDto) {
    setForm({
      id: logItem?.id ?? -1,
      status: logItem?.status ?? "",
      date: logItem?.date ?? getTodayLocalDate(),
      notes: logItem?.notes ?? "",
    });
  }

  function handleCloseModal() {
    setForm(initialForm);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="status-modal">
      <Flex direction={"column"} gap={"4"}>
        <Flex justify={"end"}>
          <IconButton
            size={"3"}
            radius={"small"}
            color={"crimson"}
            onClick={handleCloseModal}
          >
            <Cross1Icon width={"24"} height={"24"} />
          </IconButton>
        </Flex>
        <Button size={"3"} radius={"small"} onClick={() => openStatusForm()}>
          <Flex align={"center"} gap={"4"}>
            <PlusIcon width={"20"} height={"20"} />
            <Text weight={"bold"}>Add new status</Text>
          </Flex>
        </Button>
        <Box overflowY={"scroll"}>
          <Flex direction={"column"} gap={"2"}>
            {form.id === -1 && (
              <StatusInputContainer
                applicationId={applicationId}
                form={form}
                statusOptions={statusOptions}
                setForm={setForm}
              />
            )}
            {logItems
              .slice()
              .reverse()
              .map((logItem: LogItemDto) => {
                return (
                  <div key={logItem.id}>
                    {form.id === logItem.id ? (
                      <StatusInputContainer
                        applicationId={applicationId}
                        statusOptions={statusOptions}
                        form={form}
                        setForm={setForm}
                      />
                    ) : (
                      <Card>
                        <Flex align={"center"} justify={"between"}>
                          <Text>{formatDateUs(new Date(logItem.date!))}</Text>
                          <Flex align={"center"} gap={"4"}>
                            <Badge size={"3"}>
                              <Text>{logItem.status}</Text>
                            </Badge>
                            <IconButton
                              size={"3"}
                              radius={"small"}
                              onClick={() => openStatusForm(logItem)}
                            >
                              <Pencil2Icon width={"24"} height={"24"} />
                            </IconButton>
                          </Flex>
                        </Flex>
                        <Text>{logItem.notes}</Text>
                      </Card>
                    )}
                  </div>
                );
              })}
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export default StatusModal;
