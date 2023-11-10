import ReelVideoCard from "@/components/cards/ReelVideoCard";
import ReelVideosContainer from "@/components/containers/ReelVideosContainer";

function Reels() {
  const reelUrl =
    "https://utfs.io/f/a229d104-d4e0-45a7-b271-2040ef2f0d7a-3a.mp4";
  return (
    <ReelVideosContainer>
      <ReelVideoCard videoSrc={reelUrl} />
      <ReelVideoCard videoSrc={reelUrl} />
      <ReelVideoCard videoSrc={reelUrl} />
      <ReelVideoCard videoSrc={reelUrl} />
      <ReelVideoCard videoSrc={reelUrl} />
    </ReelVideosContainer>
  );
}

const ReelsPage = () => {
  return (
    <section className="pt-3 pl-4">
      <h1 className="font-bold text-2xl">Reels</h1>
      {/* Reels  */}
      <Reels></Reels>
    </section>
  );
};

export default ReelsPage;
