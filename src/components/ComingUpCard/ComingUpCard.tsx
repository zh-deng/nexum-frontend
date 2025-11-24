import { Box, Card, Flex, Text } from "@radix-ui/themes";
import "./ComingUpCard.scss";

// A card component to indicate that a feature is coming soon
const ComingUpCard = () => {
  return (
    <div className="coming-up-card">
      <Card>
        <Box height={"10rem"} width={"15rem"}>
          <Flex align={"center"} justify={"center"} height={"100%"}>
            <Text weight={"bold"} align={"center"}>
              This feature is currently in development
            </Text>
          </Flex>
        </Box>
      </Card>
    </div>
  );
};

export default ComingUpCard;
