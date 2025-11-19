"use client";

import { Box, Card, Flex, RadioCards, Text } from "@radix-ui/themes";
import InterviewCard from "../../../components/InterviewCard/InterviewCard";
import { useInterviews } from "../../../hooks/interview/useInterviews";
import "./interviews.scss";
import { useState } from "react";
import { InterviewSortType, InterviewStatusFilter } from "../../../types/enums";
import QueryState from "../../../components/QueryState/QueryState";

const InterviewsPage = () => {
  const [sortBy, setSortBy] = useState<InterviewSortType>(
    InterviewSortType.NEWEST,
  );
  const [statusFilter, setStatusFilter] = useState<InterviewStatusFilter>(
    InterviewStatusFilter.ALL,
  );

  const { data, isLoading, error } = useInterviews({
    sortBy,
    statusFilter,
  });

  return (
    <QueryState isLoading={isLoading} error={error}>
      {data && (
        <div className="interviews-page">
          <Flex
            align={"center"}
            justify={"between"}
            my={"4"}
            wrap={"wrap"}
            gap={"4"}
          >
            <Box maxWidth="200px">
              <RadioCards.Root
                defaultValue={InterviewSortType.NEWEST}
                columns={{ initial: "1", xs: "2" }}
                size={"1"}
                gap={"2"}
                onValueChange={(value) => setSortBy(value as InterviewSortType)}
              >
                <RadioCards.Item value={InterviewSortType.NEWEST}>
                  <Flex direction="column">
                    <Text weight="bold">Newest</Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value={InterviewSortType.OLDEST}>
                  <Flex direction="column">
                    <Text weight="bold">Oldest</Text>
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
            </Box>
            <Box maxWidth="310px">
              <RadioCards.Root
                defaultValue={InterviewStatusFilter.ALL}
                columns={{ initial: "1", xs: "3" }}
                size={"1"}
                gap={"2"}
                onValueChange={(value) =>
                  setStatusFilter(value as InterviewStatusFilter)
                }
              >
                <RadioCards.Item value={InterviewStatusFilter.UPCOMING}>
                  <Flex direction="column">
                    <Text weight="bold">Upcoming</Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value={InterviewStatusFilter.DONE}>
                  <Flex direction="column">
                    <Text weight="bold">Done</Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value={InterviewStatusFilter.ALL}>
                  <Flex direction="column">
                    <Text weight="bold">All</Text>
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
            </Box>
          </Flex>
          <div className="interview-container">
            {data.length === 0 ? (
              <Card className="empty-state">
                <Flex height={"6rem"} justify={"center"} align={"center"}>
                  <Text size={"4"} weight={"medium"}>
                    No interviews found
                  </Text>
                </Flex>
              </Card>
            ) : (
              data.map((item) => {
                return (
                  <div className="interview-card-wrapper" key={item.id}>
                    <InterviewCard data={item} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </QueryState>
  );
};

export default InterviewsPage;
