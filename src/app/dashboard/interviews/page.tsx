"use client";

import "./interviews.scss";
import { Box, Card, Flex, RadioCards, Text } from "@radix-ui/themes";
import InterviewCard from "../../../components/InterviewCard/InterviewCard";
import { useInterviews } from "../../../hooks/interview/useInterviews";
import { useState } from "react";
import { InterviewSortType, InterviewStatusFilter } from "../../../types/enums";
import QueryState from "../../../components/QueryState/QueryState";

const SORT_OPTIONS = [
  { value: InterviewSortType.NEWEST, label: "Newest" },
  { value: InterviewSortType.OLDEST, label: "Oldest" },
];

const FILTER_OPTIONS = [
  { value: InterviewStatusFilter.UPCOMING, label: "Upcoming" },
  { value: InterviewStatusFilter.DONE, label: "Done" },
  { value: InterviewStatusFilter.ALL, label: "All" },
];

const emptyInterviewsState = (
  <Card className="empty-state">
    <Flex height={"6rem"} justify={"center"} align={"center"}>
      <Text size={"4"} weight={"medium"}>
        No interviews found
      </Text>
    </Flex>
  </Card>
);

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
            align={"end"}
            justify={"between"}
            my={"4"}
            wrap={"wrap"}
            gap={"4"}
          >
            <Box>
              <RadioCards.Root
                value={sortBy}
                columns={{ initial: "2" }}
                size={"1"}
                gap={"2"}
                onValueChange={(value) => setSortBy(value as InterviewSortType)}
              >
                {SORT_OPTIONS.map((option) => (
                  <RadioCards.Item key={option.value} value={option.value}>
                    <Text weight="bold">{option.label}</Text>
                  </RadioCards.Item>
                ))}
              </RadioCards.Root>
            </Box>
            <Box>
              <RadioCards.Root
                value={statusFilter}
                columns={{ initial: "3" }}
                size={"1"}
                gap={"2"}
                onValueChange={(value) =>
                  setStatusFilter(value as InterviewStatusFilter)
                }
              >
                {FILTER_OPTIONS.map((option) => (
                  <RadioCards.Item key={option.value} value={option.value}>
                    <Text weight={"bold"}>{option.label}</Text>
                  </RadioCards.Item>
                ))}
              </RadioCards.Root>
            </Box>
          </Flex>
          <div className="interview-container">
            {data.length === 0
              ? emptyInterviewsState
              : data.map((item) => (
                  <div className="interview-card-wrapper" key={item.id}>
                    <InterviewCard data={item} />
                  </div>
                ))}
          </div>
        </div>
      )}
    </QueryState>
  );
};

export default InterviewsPage;
