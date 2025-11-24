"use client";

import "./reminders.scss";
import { useState } from "react";
import ReminderCard from "../../../components/ReminderCard/ReminderCard";
import { useReminders } from "../../../hooks/reminder/useReminders";
import { ReminderSortType, ReminderStatusFilter } from "../../../types/enums";
import { Box, Card, Flex, RadioCards, Text } from "@radix-ui/themes";
import QueryState from "../../../components/QueryState/QueryState";

const SORT_OPTIONS = [
  { value: ReminderSortType.NEWEST, label: "Newest" },
  { value: ReminderSortType.OLDEST, label: "Oldest" },
];

const FILTER_OPTIONS = [
  { value: ReminderStatusFilter.ACTIVE, label: "Active" },
  { value: ReminderStatusFilter.STOPPED, label: "Stopped" },
  { value: ReminderStatusFilter.DONE, label: "Done" },
  { value: ReminderStatusFilter.ALL, label: "All" },
];

const EmptyRemindersState = (
  <Card className="empty-state">
    <Flex height={"6rem"} justify={"center"} align={"center"}>
      <Text size={"4"} weight={"medium"}>
        No reminders found
      </Text>
    </Flex>
  </Card>
);

const RemindersPage = () => {
  const [sortBy, setSortBy] = useState<ReminderSortType>(
    ReminderSortType.NEWEST,
  );
  const [statusFilter, setStatusFilter] = useState<ReminderStatusFilter>(
    ReminderStatusFilter.ALL,
  );

  const { data, isLoading, error } = useReminders({
    sortBy,
    statusFilter,
  });

  return (
    <QueryState isLoading={isLoading} error={error}>
      {data && (
        <div className="reminders-page">
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
                onValueChange={(value) => setSortBy(value as ReminderSortType)}
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
                defaultValue={ReminderStatusFilter.ALL}
                columns={{ initial: "4" }}
                size={"1"}
                gap={"2"}
                onValueChange={(value) =>
                  setStatusFilter(value as ReminderStatusFilter)
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
          <div className="reminder-container">
            {data.length === 0
              ? EmptyRemindersState
              : data.map((item) => (
                  <div className="reminder-card-wrapper" key={item.id}>
                    <ReminderCard data={item} />
                  </div>
                ))}
          </div>
        </div>
      )}
    </QueryState>
  );
};

export default RemindersPage;
