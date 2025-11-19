import { Spinner } from "@radix-ui/themes";
import "./QueryState.scss";

type QueryStateProps = {
  isLoading: boolean;
  error: unknown;
  children: React.ReactNode;
};

const QueryState = ({ isLoading, error, children }: QueryStateProps) => {
  if (isLoading) {
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
