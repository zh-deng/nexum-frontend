"use client";

import { IconButton } from "@radix-ui/themes";
import "./jobs.scss";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import ApplicationForm from "../../../components/forms/ApplicationForm/ApplicationForm";
import { useApplications } from "../../../hooks/application/useApplications";
import ApplicationCard from "../../../components/ApplicationCard/ApplicationCard";

const JobsPage = () => {
  const [showAppForm, setShowAppForm] = useState<boolean>(false);
  const [showUpdateAppForm, setShowUpdateAppForm] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const { data } = useApplications();
  const pageRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className={`jobs-page ${showAppForm || showUpdateAppForm ? "no-scroll" : ""}`}
      ref={pageRef}
    >
      {/* // TODO Add search, filter and sorting functionality */}
      <div className="jobs-content">
        {data.map((app) => (
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
