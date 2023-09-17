import ThreadCard from "@/components/cards/ThreadCard";
import ThreadReply from "@/components/forms/ThreadReply";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import connectToMongoDB from "@/lib/db/connectToMongoDB";
import UserModel from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";

const ThreadPage = async (props) => {
  await connectToMongoDB();
  const user = await currentUser();
  const mongoUser = await UserModel.findOne({ clerkId: user?.id });
  const thread = await fetchThreadById(props.params.id);
  const { author, _id, threadText, parentId, community, children } = JSON.parse(
    JSON.stringify(thread)
  );
  return (
    <>
      {/* client-side component  */}
      <ThreadCard
        author={author}
        // currentUser = {}
        children={children}
        community={community || null}
        parentId={parentId}
        threadText={threadText}
        threadId={_id}
      />

      <div className="thread-replies">
        <ThreadReply
          author={author}
          currentUser={mongoUser as object}
          children={children}
          community={community || null}
          parentId={parentId}
          threadText={threadText}
          threadId={_id}
        />
      </div>
    </>
  );
};

export default ThreadPage;
