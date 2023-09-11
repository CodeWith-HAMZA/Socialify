import ThreadCard from "./cards/ThreadCard";
interface Props {
  threads: object[];
  isNextPage: boolean;
  totalThreadsCount: number;
}

function ThreadsContainer({ threads, isNextPage, totalThreadsCount }: Props) {
  return (
    <div className="threads flex flex-col p-3">
      {threads.map((thread, idx) => {
        const { author, _id, threadText, parentId, community, children } =
          JSON.parse(JSON.stringify(thread));

        return threads.length ? (
          <ThreadCard
            key={_id}
            threadId={_id}
            author={author}
            threadText={threadText}
            parentId={parentId}
            community={community || null}
            children={children}
          />
        ) : (
          <>No Threads Found</>
        );
      })}
    </div>
  );
}

export default ThreadsContainer;
