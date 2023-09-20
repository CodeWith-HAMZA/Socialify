import { fetchUserPosts } from "@/lib/actions/thread.actions";
import ThreadCard from "../cards/ThreadCard";
import { ThreadFormData } from "@/lib/validations/thread";
import { IUserSchema } from "@/lib/models/user.model";

interface Props {
  mongoUser: IUserSchema;
}
const ThreadsTab = async ({ mongoUser }: Props) => {
  const result: IUserSchema = await fetchUserPosts(mongoUser?.["_id"]);
  console.log("first", mongoUser);

  return (
    <section>
      {result?.["threads"].map((thread, idx) => {
        const { _id, author, children, community, parentId, threadText } =
          JSON.parse(JSON.stringify(thread));

        return (
          <ThreadCard
            author={author}
            // currentUser = {}
            currentUser={mongoUser as object}
            children={children}
            community={community || null}
            parentId={parentId}
            threadText={threadText}
            threadId={_id}
          />
        );
      })}
    </section>
  );
};

export default ThreadsTab;
