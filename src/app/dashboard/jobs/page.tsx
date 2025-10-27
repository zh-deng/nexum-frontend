"use client";

import {
  Card,
  ChevronDownIcon,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import "./jobs.scss";
import { ChevronUpIcon, PlusIcon } from "@radix-ui/react-icons";
import { useMemo, useRef, useState } from "react";
import ApplicationForm from "../../../components/forms/ApplicationForm/ApplicationForm";
import { useApplications } from "../../../hooks/application/useApplications";
import ApplicationCard from "../../../components/ApplicationCard/ApplicationCard";
import { SortType } from "../../../types/enums";
import Dropdown from "../../../components/Dropdown/Dropdown";
import FloatingTextField from "../../../components/FloatingTextField/FloatingTextField";

const JobsPage = () => {
  const [showAppForm, setShowAppForm] = useState<boolean>(false);
  const [showUpdateAppForm, setShowUpdateAppForm] = useState<boolean>(false);
  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>(SortType.DATE_NEW);
  const { data } = useApplications();
  const pageRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    "ALPHABETICAL_TITLE",
    "ALPHABETICAL_COMPANY",
    "DATE_NEW",
    "DATE_OLD",
    "PRIORITY",
  ].filter((elem) => elem !== sortBy);

  const sortedApplications = useMemo(() => {
    if (!data) return [];

    let preSortedApplicaton = data;

    switch (sortBy) {
      case SortType.ALPHABETICAL_TITLE:
        preSortedApplicaton = [...preSortedApplicaton].sort((a, b) =>
          a.jobTitle.localeCompare(b.jobTitle),
        );
        break;
      case SortType.ALPHABETICAL_COMPANY:
        preSortedApplicaton = [...preSortedApplicaton].sort((a, b) =>
          a.company.name.localeCompare(b.company.name),
        );
        break;
      case SortType.DATE_NEW:
        preSortedApplicaton = [...preSortedApplicaton].sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        );
        break;
      case SortType.DATE_OLD:
        preSortedApplicaton = [...preSortedApplicaton].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        break;
      case SortType.PRIORITY:
        const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        preSortedApplicaton = [...preSortedApplicaton].sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
        );
        break;
    }

    return preSortedApplicaton
      .slice()
      .sort((a, b) => Number(b.favorited) - Number(a.favorited));
  }, [data, sortBy]);

  function openUpdateAppForm() {
    setShowUpdateAppForm(true);
    scrollToTop();
  }

  function openAppForm() {
    setShowAppForm(true);
    scrollToTop();
  }

  function scrollToTop() {
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }

  function toggleSortFilter() {
    setShowFilterOptions(!showFilterOptions);
  }

  function updateSort(selected: string) {
    setSortBy(selected);
    console.log("TEST");
  }

  return (
    <div
      className={`jobs-page ${showAppForm || showUpdateAppForm ? "no-scroll" : ""}`}
      ref={pageRef}
    >
      <div className="sort-filter-container">
        <Card onClick={toggleSortFilter}>
          <Flex align={"center"} justify={"center"} gap={"2"}>
            <Text>{`${showFilterOptions ? "Hide" : "Show"} Sort and Filter`}</Text>
            {showFilterOptions ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Flex>
        </Card>
        {showFilterOptions && (
          <Card className="jobs-sort-filter">
            <div className="sort-dropdown-container">
              <p>Sort By:</p>
              <div className="sort-dropdown">
                <Dropdown
                  name={sortBy}
                  options={sortOptions}
                  onChange={updateSort}
                />
              </div>
            </div>
            <div className="keyword-container">
              <div className="keyword-input">
                <p>Search By:</p>
                <FloatingTextField placeholder="Keywords" />
              </div>
              <div>
                <p>Page Size: </p>
                <Dropdown
                  name={"10"}
                  options={["20", "50", "All"]}
                  onChange={function (value: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
      {/* TODO add pagination */}
      <div className="pagination-container">
        <div>First | Previous | Page 1 / 2 | Next | Last</div>
      </div>
      <div className="jobs-content">
        {sortedApplications.map((app) => (
          <div key={app.id}>
            <ApplicationCard
              data={app}
              expandedCardId={expandedCardId}
              setExpandedCardId={setExpandedCardId}
              editApplication={openUpdateAppForm}
            />
            {showUpdateAppForm && expandedCardId === app.id && (
              <ApplicationForm
                data={app}
                onClose={() => setShowUpdateAppForm(false)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="pagination-container">
        <div>First | Previous | Page 1 / 2 | Next | Last</div>
      </div>
      <IconButton
        className="add-button"
        variant="surface"
        onClick={openAppForm}
      >
        <PlusIcon width="32" height="32" />
      </IconButton>
      {showAppForm && <ApplicationForm onClose={() => setShowAppForm(false)} />}
    </div>
  );
};

export default JobsPage;
