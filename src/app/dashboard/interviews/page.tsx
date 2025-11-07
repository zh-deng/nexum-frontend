"use client";

import { Box, Flex, RadioCards, Text } from "@radix-ui/themes";
import InterviewCard from "../../../components/InterviewCard/InterviewCard";
import { useInterviews } from "../../../hooks/interview/useInterview";
import "./interviews.scss";

const InterviewsPage = () => {
  const { data } = useInterviews();

  return (
    <div className="interviews-page">
      <Flex align={"center"} justify={"between"} my={"4"}>
        <div>Sort by old/new, include exclude done</div>
        <Box maxWidth="300px">
          <RadioCards.Root
            defaultValue="all"
            columns={{ initial: "1", sm: "3" }}
            size={"1"}
          >
            <RadioCards.Item value="upcoming">
              <Flex direction="column">
                <Text weight="bold">Upcoming</Text>
              </Flex>
            </RadioCards.Item>
            <RadioCards.Item value="done">
              <Flex direction="column">
                <Text weight="bold">Done</Text>
              </Flex>
            </RadioCards.Item>
            <RadioCards.Item value="all">
              <Flex direction="column">
                <Text weight="bold">All</Text>
              </Flex>
            </RadioCards.Item>
          </RadioCards.Root>
        </Box>
      </Flex>
      <div className="interview-container">
        {data.map((item) => {
          return <InterviewCard key={item.id} data={item} />;
        })}
      </div>
    </div>
  );
};

export default InterviewsPage;
