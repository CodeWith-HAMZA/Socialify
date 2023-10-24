"use client";
import React, { ReactNode, useEffect } from "react";

interface ReelVideosContainerProps {
  children: ReactNode;
}

const ReelVideosContainer: React.FC<ReelVideosContainerProps> = ({
  children,
}) => {
  useEffect(() => {
    // selecting the cards which will be observed for intersepting events to handle play/pause, when come up into "View"
    const elements = document.querySelectorAll(".video");
    elements.forEach((element) => observer.observe(element));
  }, []);
  const callback: IntersectionObserverCallback = (enteries, observer) => {
    enteries.forEach(async (entry) => {
      const video = entry.target as HTMLDivElement;
      const videoElement = video.firstChild as HTMLVideoElement;

      if (!entry.isIntersecting) {
        await videoElement?.pause();
      } else {
        videoElement.currentTime = 0; // Set video time to 0 to start from the beginning
        await videoElement?.play();
      }
    });
  };
  let options = {
    root: null, // Viewport is the root
    rootMargin: "0px",
    threshold: 0.5, // Trigger when 50% of the video is visible
  };
  const observer = new IntersectionObserver(callback, options);

  return (
    <div className="videosContainer overflow-y-scroll h-[73vh] snap-y snap-mandatory">
      {/* snap-y snap-mandatory property don't work on display:flex element  */}
      <div
        className="videos flex justify-center gap-[2rem] flex-col items-center "
        children={children}
      />
    </div>
  );
};

export default ReelVideosContainer;
