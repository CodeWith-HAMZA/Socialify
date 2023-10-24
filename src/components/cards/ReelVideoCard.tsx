import React from "react";

interface ReelVideoCardProps {
  videoSrc: string;
}

const ReelVideoCard: React.FC<ReelVideoCardProps> = ({ videoSrc }) => {
  return (
    <div className="video h-[70vh] w-[28vw] snap-start ">
      <video
        src={videoSrc}
        loop
        className="h-full w-full object-cover rounded-lg"
        // controls
      />
    </div>
  );
};

export default ReelVideoCard;
