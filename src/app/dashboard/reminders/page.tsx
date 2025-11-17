"use client";

import { useState } from "react";
import ReminderCard from "../../../components/ReminderCard/ReminderCard";
import { useReminders } from "../../../hooks/reminder/useReminders";
import { ReminderSortType, ReminderStatusFilter } from "../../../types/enums";
import "./reminders.scss";
import { Box, Flex, RadioCards, Text } from "@radix-ui/themes";
import QueryState from "../../../components/QueryState/QueryState";

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
            align={"center"}
            justify={"between"}
            my={"4"}
            wrap={"wrap"}
            gap={"4"}
          >
            <Box maxWidth="200px">
              <RadioCards.Root
                defaultValue={ReminderSortType.NEWEST}
                columns={{ initial: "1", xs: "2" }}
                size={"1"}
                gap={"2"}
                onValueChange={(value) => setSortBy(value as ReminderSortType)}
              >
                <RadioCards.Item value={ReminderSortType.NEWEST}>
                  <Flex direction="column">
                    <Text weight="bold">Newest</Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value={ReminderSortType.OLDEST}>
                  <Flex direction="column">
                    <Text weight="bold">Oldest</Text>
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
            </Box>
            <Box maxWidth="310px">
              <RadioCards.Root
                defaultValue={ReminderStatusFilter.ALL}
                columns={{ initial: "1", xs: "4" }}
                size={"1"}
                gap={"2"}
                onValueChange={(value) =>
                  setStatusFilter(value as ReminderStatusFilter)
                }
              >
                <RadioCards.Item value={ReminderStatusFilter.ACTIVE}>
                  <Flex direction="column">
                    <Text weight="bold">Active</Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value={ReminderStatusFilter.STOPPED}>
                  <Flex direction="column">
                    <Text weight="bold">Stopped</Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value={ReminderStatusFilter.DONE}>
                  <Flex direction="column">
                    <Text weight="bold">Done</Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value={ReminderStatusFilter.ALL}>
                  <Flex direction="column">
                    <Text weight="bold">All</Text>
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
            </Box>
          </Flex>
          <div className="reminder-container">
            {data.map((item) => (
              <ReminderCard data={item} key={item.id} />
            ))}
          </div>
        </div>
      )}
    </QueryState>
  );
};

export default RemindersPage;
