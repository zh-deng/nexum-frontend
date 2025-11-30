import Image from "next/image";
import "./GhostBadge.scss";

const GhostBadge = () => {
  return (
    <div className="ghost-badge">
      <Image
        className="ghost-svg"
        src="/ghost.svg"
        alt="Ghost Icon"
        width={70}
        height={70}
      />
    </div>
  );
};

export default GhostBadge;
