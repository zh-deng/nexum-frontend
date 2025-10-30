import { Button } from "@radix-ui/themes";
import { Pagination } from "../../types/dtos/application/application.dto";
import "./PaginationControls.scss";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

type PaginationControlsProps = {
  pagination: Pagination;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const PaginationControls = ({
  pagination,
  currentPage,
  setCurrentPage,
}: PaginationControlsProps) => {
  return (
    <div className="pagination-container">
      <Button
        size={"3"}
        onClick={() => setCurrentPage(1)}
        disabled={!pagination.hasPrev}
        style={{ cursor: pagination.hasPrev ? "pointer" : "not-allowed" }}
      >
        <DoubleArrowLeftIcon />
      </Button>
      <Button
        size={"3"}
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={!pagination.hasPrev}
        style={{ cursor: pagination.hasPrev ? "pointer" : "not-allowed" }}
      >
        <ChevronLeftIcon />
      </Button>
      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <Button
        size={"3"}
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={!pagination.hasNext}
        style={{ cursor: pagination.hasNext ? "pointer" : "not-allowed" }}
      >
        <ChevronRightIcon />
      </Button>
      <Button
        size={"3"}
        onClick={() => setCurrentPage(pagination.totalPages)}
        disabled={!pagination.hasNext}
        style={{ cursor: pagination.hasNext ? "pointer" : "not-allowed" }}
      >
        <DoubleArrowRightIcon />
      </Button>
    </div>
  );
};

export default PaginationControls;
