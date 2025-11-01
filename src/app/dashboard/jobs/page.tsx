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
import { ApplicationStatus, SortType } from "../../../types/enums";
import Dropdown from "../../../components/Dropdown/Dropdown";
import FloatingTextField from "../../../components/FloatingTextField/FloatingTextField";
import { useDebounce } from "../../../hooks/useDebounce";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import JobOptions from "../../../components/JobSettings/JobSettings";

const JobsPage = () => {
  const [showAppForm, setShowAppForm] = useState<boolean>(false);
  const [showUpdateAppForm, setShowUpdateAppForm] = useState<boolean>(false);
  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>(SortType.DATE_NEW);

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data } = useApplications({
    searchQuery: debouncedSearch,
    status: statusFilter,
    page: currentPage,
    limit: pageSize,
    sortBy: sortBy,
  });

  const applications = data?.data || [];
  const pagination = data?.pagination;

  const sortOptions = Object.values(SortType).filter(
    (option) => option !== sortBy,
  );

  const statusOptions = ["ALL", ...Object.values(ApplicationStatus)].filter(
    (option) => option !== statusFilter,
  );

  const favoritedApplications = useMemo(() => {
    if (!applications) return [];

    return applications
      .slice()
      .sort((a, b) => Number(b.favorited) - Number(a.favorited));
  }, [applications]);

  function openUpdateAppForm() {
    setShowUpdateAppForm(true);
    scrollToTop();
  }

  function openAppForm() {
    setShowAppForm(true);
    scrollToTop();
  }

  function closeUpdateAppForm() {
    setShowUpdateAppForm(false);
    setExpandedCardId(null);
  }

  function closeAppForm() {
    setShowAppForm(false);
    setExpandedCardId(null);
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
    setSortBy(selected as SortType);
  }

  // Reset to page 1 when search or filters change
  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value === "All" ? "" : value);
    setCurrentPage(1);
  }

  function handlePageSizeChange(size: string) {
    setPageSize(parseInt(size));
    setCurrentPage(1);
  }

  return (
    <div
      className={`jobs-page ${showAppForm || showUpdateAppForm ? "no-scroll" : ""}`}
      ref={pageRef}
    >
      <div className="sort-filter-container">
        <Flex align={"center"} gap={"4"}>
          <Card
            onClick={toggleSortFilter}
            style={{ flex: 1, cursor: "pointer" }}
          >
            <Flex align={"center"} justify={"center"} gap={"2"}>
              <Text>{`${showFilterOptions ? "Hide" : "Show"} Sort and Filter`}</Text>
              {showFilterOptions ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Flex>
          </Card>
          <JobOptions />
        </Flex>
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
            <div className="status-dropdown-container">
              <p>Filter By Status:</p>
              <div className="status-dropdown">
                <Dropdown
                  name={statusFilter || "All"}
                  options={statusOptions}
                  onChange={handleStatusChange}
                />
              </div>
            </div>
            <div className="keyword-container">
              <div className="keyword-input">
                <p>Search:</p>
                <FloatingTextField
                  placeholder="Search by title, company, location..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <div className="page-size-input">
                <p>Page Size: </p>
                <Dropdown
                  name={pageSize.toString()}
                  options={["10", "20", "50", "100"]}
                  onChange={handlePageSizeChange}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
      {pagination && (
        <div className="results-info">
          Showing {applications.length} of {pagination.total} applications
          {debouncedSearch && ` matching "${debouncedSearch}"`}
        </div>
      )}
      {pagination && pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      <div className="jobs-content">
        {applications.length === 0 ? (
          <Card className="empty-state">
            <Flex height={"6rem"} justify={"center"} align={"center"}>
              <Text size={"4"} weight={"medium"}>
                {searchQuery || statusFilter
                  ? "No applications found"
                  : "No applications yet"}
              </Text>
            </Flex>
          </Card>
        ) : (
          favoritedApplications.map((app, index) => (
            <div className="application-card-wrapper" key={app.id}>
              <ApplicationCard
                data={app}
                expandedCardId={expandedCardId}
                positionIndex={index}
                setExpandedCardId={setExpandedCardId}
                editApplication={openUpdateAppForm}
              />
              {showUpdateAppForm && expandedCardId === app.id && (
                <ApplicationForm data={app} onClose={closeUpdateAppForm} />
              )}
            </div>
          ))
        )}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      <IconButton
        style={{ cursor: "pointer" }}
        className="add-button"
        variant="surface"
        onClick={openAppForm}
      >
        <PlusIcon width="32" height="32" />
      </IconButton>
      {showAppForm && <ApplicationForm onClose={closeAppForm} />}
    </div>
  );
};

export default JobsPage;
