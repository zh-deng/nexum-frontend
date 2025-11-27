import { Button, Dialog, Flex, Spinner, Text } from "@radix-ui/themes";
import "./ConfirmationModal.scss";

type ConfirmationModalProps = {
  questionString?: string;
  confirmationString?: string;
  abortionString?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirmation: () => void;
  onAbortion: () => void;
};

const ConfirmationModal = ({
  isOpen,
  isLoading = false,
  questionString = "Are you sure?",
  confirmationString = "YES",
  abortionString = "NO",
  onConfirmation,
  onAbortion,
}: ConfirmationModalProps) => {
  function confirmAndClose() {
    onConfirmation();
    if (!isLoading) {
      onAbortion();
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onAbortion()}>
      <Dialog.Content maxWidth={"250px"}>
        <Dialog.Title align={"center"}>{questionString}</Dialog.Title>

        <Flex gap={"6"} mt={"5"} justify={"center"}>
          <Button
            style={{ cursor: "pointer" }}
            size={"3"}
            onClick={confirmAndClose}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="2" /> : confirmationString}
          </Button>
          <Button
            variant={"soft"}
            color={"gray"}
            style={{ cursor: "pointer" }}
            size={"3"}
            onClick={onAbortion}
            disabled={isLoading}
          >
            {abortionString}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConfirmationModal;
