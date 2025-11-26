import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import "./ConfirmationModal.scss";

type ConfirmationModalProps = {
  questionString?: string;
  confirmationString?: string;
  abortionString?: string;
  isOpen: boolean;
  onConfirmation: () => void;
  onAbortion: () => void;
};

const ConfirmationModal = ({
  isOpen,
  questionString = "Are you sure?",
  confirmationString = "YES",
  abortionString = "NO",
  onConfirmation,
  onAbortion,
}: ConfirmationModalProps) => {
  function confirmAndClose() {
    onConfirmation();
    onAbortion();
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
          >
            {confirmationString}
          </Button>
          <Button
            variant={"soft"}
            color={"gray"}
            style={{ cursor: "pointer" }}
            size={"3"}
            onClick={onAbortion}
          >
            {abortionString}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConfirmationModal;
