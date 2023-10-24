import ReelVideoCard from "@/components/cards/ReelVideoCard";
import ReelVideosContainer from "@/components/containers/ReelVideosContainer";

const ReelsPage = () => {
  return (
    <section className="pt-3 pl-4">
      <h1 className="font-bold text-2xl">Reels</h1>

      <ReelVideosContainer>
        <ReelVideoCard videoSrc="/v.mp4" />
        <ReelVideoCard videoSrc="/v.mp4" />
        <ReelVideoCard videoSrc="/v.mp4" />
        <ReelVideoCard videoSrc="/v.mp4" />
      </ReelVideosContainer>
    </section>
  );
};

export default ReelsPage;
