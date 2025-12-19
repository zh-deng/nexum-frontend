import { Box, RadioCards, Flex, Text } from "@radix-ui/themes";
import "./RadioCardGroup.scss";
import { humanizeEnumLabel } from "../../utils/helper";

type RadioCardGroupProps = {
  title?: string;
  options: string[];
  defaultValue: string;
  onChange: (value: string) => void;
};

const RadioCardGroup = ({
  title,
  options,
  defaultValue,
  onChange,
}: RadioCardGroupProps) => {
  const PATTERN = /^[A-Z0-9_]+$/;
  const optionsLength = options.length;

  return (
    <Box maxWidth="600px">
      <Flex direction={"column"} gap={"1"}>
        {title && (
          <Text size={"2"} weight={"medium"}>
            {title}
          </Text>
        )}
        <RadioCards.Root
          defaultValue={defaultValue}
          columns={{ initial: "1", xs: `${optionsLength}` }}
          size={"1"}
          onValueChange={onChange}
        >
          {options.map((option) => {
            const optionName = PATTERN.test(option)
              ? humanizeEnumLabel(option)
              : option;
            return (
              <RadioCards.Item
                value={option}
                key={option}
                style={{ cursor: "pointer" }}
              >
                <Flex direction={"column"} width={"100%"} align={"center"}>
                  <Text weight={"medium"}>{optionName}</Text>
                </Flex>
              </RadioCards.Item>
            );
          })}
        </RadioCards.Root>
      </Flex>
    </Box>
  );
};

export default RadioCardGroup;
