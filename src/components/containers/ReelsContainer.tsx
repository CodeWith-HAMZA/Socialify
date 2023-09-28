import React from "react";
interface Props {
  children: React.ReactNode;
}
const ReelsContainer = ({ children }: Props) => {
  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4 text-white">Reels</h1>
      <div className="reel-container  pb-4 px-2">{children}</div>
    </div>
  );
};

export default ReelsContainer;
