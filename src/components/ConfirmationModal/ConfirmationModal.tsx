import { Button, Flex, Text } from "@radix-ui/themes";
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

  if (!isOpen) return null;

  return (
    <div className="confirmation-modal">
      <Flex direction={"column"} gap={"6"} align={"center"}>
        <Text size={"5"} weight={"bold"}>
          {questionString}
        </Text>
        <Flex gap={"7"}>
          <Button size={"4"} onClick={confirmAndClose}>
            {confirmationString}
          </Button>
          <Button size={"4"} onClick={onAbortion}>
            {abortionString}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default ConfirmationModal;
