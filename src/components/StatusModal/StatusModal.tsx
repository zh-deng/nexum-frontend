"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Spinner,
  Text,
} from "@radix-ui/themes";
import "./StatusModal.scss";
import {
  formatDateUs,
  getLocalDatetimeValue,
  getStatusOptions,
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
import { useToast } from "../ToastProvider/ToastProvider";
import { useBreakpoint } from "../../hooks/useBreakpoint";

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

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [statusError, setStatusError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { isSm } = useBreakpoint();
  const toast = useToast();
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

    setIsSubmitting(true);
    try {
      const { id, date, ...rest } = form;

      if (form.id === -1) {
        await createLogItem.mutateAsync({
          applicationId: applicationId,
          date: new Date(date).toISOString(),
          ...rest,
        });

        toast.success("Successfully created status");
        resetId();
      } else {
        if (typeof id !== "string") return;

        await updateLogItem.mutateAsync({
          id,
          data: {
            date: new Date(date).toISOString(),
            ...rest,
          },
        });

        toast.success("Successfully updated status");
        resetId();
      }
    } catch (error: unknown) {
      console.error("Create or update log item error:", error);
      toast.error("Failed to create or update status");
    } finally {
      setIsSubmitting(false);
    }
  }
  async function handleDeleteLogItem() {
    try {
      if (typeof form.id !== "string") return;

      await deleteLogItem.mutateAsync(form.id);

      toast.success("Successfully deleted status");
    } catch (error: unknown) {
      console.error("Delete log item error:", error);
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="status-input-container">
      <Card>
        <Flex direction={"column"} gap={"4"}>
          <Flex justify={"between"} wrap={"wrap"} gap={"4"}>
            <Dropdown
              width={isSm ? "50%" : "100%"}
              name={form.status || "Status"}
              options={options}
              onChange={(value) =>
                handleChange({ name: "status", value: value })
              }
            />
            <FloatingTextField
              type={"datetime-local"}
              placeholder="Action Date"
              value={getLocalDatetimeValue(form.date)}
              onChange={(value) =>
                handleChange({ name: "date", value: value.target.value })
              }
            />
          </Flex>
          <FloatingTextArea
            placeholder={"Notes"}
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
            <Flex gap={"4"} justify={"start"} width={"100%"}>
              <IconButton
                style={{ cursor: "pointer" }}
                size={"3"}
                radius={"small"}
                onClick={createOrUpdateLogItem}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner size="2" />
                ) : (
                  <CheckIcon width={"24"} height={"24"} />
                )}
              </IconButton>
              <IconButton
                style={{ cursor: "pointer" }}
                size={"3"}
                radius={"small"}
                color={"crimson"}
                onClick={resetId}
                disabled={isSubmitting}
              >
                <Cross1Icon width={"24"} height={"24"} />
              </IconButton>
            </Flex>
            {form.id !== -1 && form.status !== ApplicationStatus.DRAFT && (
              <IconButton
                style={{ cursor: "pointer" }}
                size={"3"}
                radius={"small"}
                color={"red"}
                onClick={() => setShowConfirmationModal(true)}
                disabled={isSubmitting}
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
    </div>
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
  const statusOptions = getStatusOptions(logItems ?? []);
  const initialForm = {
    id: null,
    status: "",
    date: "",
    notes: "",
  };

  const [form, setForm] = useState<LogItemForm>(initialForm);

  function openStatusForm(logItem?: LogItemDto) {
    setForm({
      id: logItem?.id ?? -1,
      status: logItem?.status ?? "",
      date: logItem?.date ?? new Date(Date.now()).toISOString(),
      notes: logItem?.notes ?? "",
    });
  }

  function handleCloseModal() {
    setForm(initialForm);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && handleCloseModal()}
    >
      <Dialog.Title />
      <Dialog.Content className="status-modal">
        <Flex direction={"column"} gap={"4"}>
          <Flex justify={"end"}>
            <IconButton
              style={{ cursor: "pointer" }}
              size={"3"}
              radius={"small"}
              color={"crimson"}
              onClick={handleCloseModal}
            >
              <Cross1Icon width={"24"} height={"24"} />
            </IconButton>
          </Flex>
          <Button
            style={{ cursor: "pointer" }}
            size={"3"}
            radius={"small"}
            onClick={() => openStatusForm()}
          >
            <Flex align={"center"} gap={"4"}>
              <PlusIcon width={"20"} height={"20"} />
              <Text weight={"bold"}>Add new status</Text>
            </Flex>
          </Button>
          <Box overflowY={"auto"}>
            <Flex direction={"column"} gap={"2"} pb={"2"}>
              {form.id === -1 && (
                <StatusInputContainer
                  applicationId={applicationId}
                  form={form}
                  statusOptions={statusOptions}
                  setForm={setForm}
                />
              )}
              {(logItems ?? []).slice().map((logItem: LogItemDto) => {
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
                          <Text>
                            {formatDateUs(new Date(logItem.date!), true)}
                          </Text>
                          <Flex align={"center"} gap={"4"}>
                            <Badge size={"3"}>
                              <Text>{logItem.status}</Text>
                            </Badge>
                            <IconButton
                              style={{ cursor: "pointer" }}
                              size={"2"}
                              radius={"small"}
                              onClick={() => openStatusForm(logItem)}
                            >
                              <Pencil2Icon width={"20"} height={"20"} />
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
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StatusModal;
