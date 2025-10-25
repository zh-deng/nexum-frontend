"use client";

import { IconButton } from "@radix-ui/themes";
import "./jobs.scss";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import ApplicationForm from "../../../components/forms/ApplicationForm/ApplicationForm";
import { useApplications } from "../../../hooks/application/useApplications";
import ApplicationCard from "../../../components/ApplicationCard/ApplicationCard";

const JobsPage = () => {
  const [showAppForm, setShowAppForm] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { data } = useApplications();

  return (
    <div className="jobs-page">
      {/* // TODO Add search, filter and sorting functionality */}
      <div className="jobs-content">
        {data.map((app) => (
          <ApplicationCard
            key={app.id}
            data={app}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
          />
        ))}
      </div>
      <IconButton className="add-button" onClick={() => setShowAppForm(true)}>
        <PlusIcon width="32" height="32" />
      </IconButton>
      {showAppForm && <ApplicationForm onClose={() => setShowAppForm(false)} />}
    </div>
  );
};

export default JobsPage;
