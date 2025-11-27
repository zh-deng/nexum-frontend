"use client";

import "./jobs.scss";
import { Box, Card, Flex, IconButton, Text } from "@radix-ui/themes";
import { MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import ApplicationForm from "../../../components/forms/ApplicationForm/ApplicationForm";
import { useApplications } from "../../../hooks/application/useApplications";
import ApplicationCard from "../../../components/ApplicationCard/ApplicationCard";
import { ApplicationStatus, SortType } from "../../../types/enums";
import Dropdown from "../../../components/Dropdown/Dropdown";
import FloatingTextField from "../../../components/FloatingTextField/FloatingTextField";
import { useDebounce } from "../../../hooks/useDebounce";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import QueryState from "../../../components/QueryState/QueryState";
import ApplicationPreview from "../../../components/ApplicationPreview/ApplicationPreview";
import { ApplicationDto } from "../../../types/dtos/application/application.dto";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

const JobsPage = () => {
  const [activeForm, setActiveForm] = useState<"create" | "update" | null>(
    null,
  );
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<ApplicationDto | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>(SortType.DATE_NEW);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  const pageRef = useRef<HTMLDivElement>(null);

  const { isSm, isMd, isLg } = useBreakpoint();
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data, isLoading, error } = useApplications({
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

  // Memoized sorted applications with favorited ones on top
  const favoritedApplications = useMemo(() => {
    if (!applications) return [];

    return applications
      .slice()
      .sort((a, b) => Number(b.favorited) - Number(a.favorited));
  }, [applications]);

  useEffect(() => {
    // Expand the first favorited application card on medium screens or above
    if (isMd && !showStatusModal) {
      setExpandedCard(favoritedApplications[0]);
    }
  }, [favoritedApplications, isMd]);

  useEffect(() => {
    // Update expandedCard when applications data changes
    if (expandedCard) {
      const updatedApp = applications.find((app) => app.id === expandedCard.id);
      if (updatedApp) {
        setExpandedCard(updatedApp);
      }
    }
  }, [applications]);

  useEffect(() => {
    if (!isLg) {
      setShowSortOptions(false);
    }
  }, [isLg]);

  function scrollToTop() {
    pageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openAppForm(isUpdate: boolean = false) {
    isUpdate ? setActiveForm("update") : setActiveForm("create");
    scrollToTop();
  }

  function closeAppForm() {
    setActiveForm(null);
    !isMd && setExpandedCard(null);
  }

  // Reset to page 1 when search or filters change
  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value === "ALL" ? "" : value);
    setCurrentPage(1);
  }

  function handlePageSizeChange(size: string) {
    setPageSize(parseInt(size));
    setCurrentPage(1);
  }

  return (
    <QueryState isLoading={isLoading} error={error}>
      <div
        className={`jobs-page ${activeForm ? "no-scroll" : ""}`}
        ref={pageRef}
      >
        <Flex
          width={"100%"}
          align={"end"}
          justify={isMd ? "between" : "end"}
          my={"2"}
          px={"2"}
          gap={"2"}
          wrap={isMd ? "nowrap" : "wrap"}
        >
          <Flex gap={"6"} gapY={"2"} flexGrow={"1"} wrap={"wrap-reverse"}>
            <Box width={isSm ? "300px" : "100%"}>
              <FloatingTextField
                placeholder="Search by title, company, location..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </Box>
            {(isLg || showSortOptions) && (
              <Flex wrap={"wrap"} gap={"6"} gapY={"2"}>
                <Flex align={"center"} gap={"2"}>
                  <Text size={"2"} wrap={"nowrap"}>
                    Sort By:
                  </Text>
                  <Dropdown
                    name={sortBy}
                    options={sortOptions}
                    width={"200px"}
                    onChange={(value) => setSortBy(value as SortType)}
                  />
                </Flex>
                <Flex align={"center"} gap={"2"}>
                  <Text size={"2"}>Filter By Status:</Text>
                  <Dropdown
                    name={statusFilter || "All"}
                    options={statusOptions}
                    width={"150px"}
                    onChange={handleStatusChange}
                  />
                </Flex>
                <Flex align={"center"} gap={"2"}>
                  <Text size={"2"}>Page size:</Text>
                  <Dropdown
                    name={pageSize.toString()}
                    options={["10", "20", "50", "100"]}
                    width={"75px"}
                    onChange={handlePageSizeChange}
                  />
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex
            justify={"between"}
            width={isLg ? "auto" : "100%"}
            align={"end"}
          >
            {!isLg && (
              <IconButton
                variant={"surface"}
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <MixerHorizontalIcon width={"20"} height={"20"} />
              </IconButton>
            )}
            {pagination && (
              <div className="results-info">
                Showing {applications.length} of {pagination.total} applications
                {debouncedSearch && ` matching "${debouncedSearch}"`}
              </div>
            )}
          </Flex>
        </Flex>

        {pagination && pagination.totalPages > 1 && (
          <PaginationControls
            pagination={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <div className="job-container">
          {applications.length === 0 ? (
            <EmptyApplicationsState
              hasFilters={!!(searchQuery || statusFilter)}
            />
          ) : (
            <Flex
              gap={"2"}
              direction={isSm ? "row" : "column"}
              className="jobs-flex-container"
            >
              <Box className="jobs-list-wrapper">
                {isMd ? (
                  <Card className="container-wrapper">
                    <div className="application-card-container">
                      {favoritedApplications.map((app) => (
                        <div className="application-card-wrapper" key={app.id}>
                          <ApplicationCard
                            data={app}
                            expandedCard={expandedCard}
                            setExpandedCard={setExpandedCard}
                            editApplication={() => openAppForm(true)}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <div className="container-wrapper">
                    <div className="application-card-container">
                      {favoritedApplications.map((app) => (
                        <div className="application-card-wrapper" key={app.id}>
                          <ApplicationCard
                            data={app}
                            expandedCard={expandedCard}
                            setExpandedCard={setExpandedCard}
                            editApplication={() => openAppForm(true)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Box>
              {isMd && expandedCard && (
                <div className="application-preview-wrapper">
                  <ApplicationPreview
                    data={expandedCard}
                    showStatusModal={showStatusModal}
                    setShowStatusModal={setShowStatusModal}
                    editApplication={() => openAppForm(true)}
                  />
                </div>
              )}
            </Flex>
          )}
        </div>
        <IconButton
          style={{ cursor: "pointer" }}
          className="add-button"
          variant={"surface"}
          onClick={() => openAppForm()}
        >
          <PlusIcon width={"32"} height={"32"} />
        </IconButton>
        <ApplicationForm
          key={"create-new"}
          isOpen={activeForm === "create"}
          setExpandedCard={setExpandedCard}
          onClose={closeAppForm}
        />
        {expandedCard && (
          <ApplicationForm
            key={`edit-${expandedCard.id}`}
            isOpen={activeForm === "update"}
            data={expandedCard}
            setExpandedCard={setExpandedCard}
            onClose={closeAppForm}
          />
        )}
      </div>
    </QueryState>
  );
};

const EmptyApplicationsState = ({ hasFilters }: { hasFilters: boolean }) => (
  <Card className="empty-state">
    <Flex height={"6rem"} justify={"center"} align={"center"}>
      <Text size={"4"} weight={"medium"}>
        {hasFilters ? "No applications found" : "No applications yet"}
      </Text>
    </Flex>
  </Card>
);

export default JobsPage;
