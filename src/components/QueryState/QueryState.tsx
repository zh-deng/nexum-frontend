import { Spinner } from "@radix-ui/themes";
import "./QueryState.scss";

type QueryStateProps = {
  isLoading?: boolean;
  isPending?: boolean;
  error: unknown;
  children: React.ReactNode;
};

// Component to handle loading, error, and success states of a query
const QueryState = ({
  isLoading,
  isPending,
  error,
  children,
}: QueryStateProps) => {
  if (isLoading || isPending) {
    return (
      <div className="loading-spinner">
        <Spinner size={"3"} />
      </div>
    );
  }

  if (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";

    return <div>Error: {message}</div>;
  }

  return <>{children}</>;
};

export default QueryState;
