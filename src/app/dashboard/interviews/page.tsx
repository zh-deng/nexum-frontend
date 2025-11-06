"use client";

import ComingUpCard from "../../../components/ComingUpCard/ComingUpCard";
import InterviewCard from "../../../components/InterviewCard/InterviewCard";
import { useInterviews } from "../../../hooks/interview/useInterview";
import "./interviews.scss";

const InterviewsPage = () => {
  const { data } = useInterviews();

  return (
    <div className="interviews-page">
      <div>Sort by old/new, include exclude done</div>
      <div className="interview-container">
        {data.map((item) => {
          return <InterviewCard key={item.id} data={item} />;
        })}
      </div>
    </div>
  );
};

export default InterviewsPage;
