import "./NewBadge.scss";

type NewBadgeProps = {
  date: string;
};

const NewBadge = ({ date }: NewBadgeProps) => {
  if (new Date(date).getDate() !== new Date(Date.now()).getDate()) return <></>;

  return <div className="new-badge">NEW</div>;
};

export default NewBadge;
