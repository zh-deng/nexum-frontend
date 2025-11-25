import { Callout } from "@radix-ui/themes";
import "./InfoBox.scss";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type InfoBoxProps = {
  text: string;
};

const InfoBox = ({ text }: InfoBoxProps) => {
  return (
    <Callout.Root size={"1"} variant={"surface"}>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>{text}</Callout.Text>
    </Callout.Root>
  );
};

export default InfoBox;
