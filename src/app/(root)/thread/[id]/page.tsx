import ThreadCard from "@/components/cards/ThreadCard";
import ThreadReply from "@/components/forms/ThreadReply";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import connectToMongoDB from "@/lib/db/connectToMongoDB";
import UserModel, { IUserSchema } from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const ThreadPage = async (props) => {
  const user = await currentUser();
  if (!user) return redirect("/");

  const mongoUser = await fetchUser(user?.id ?? "");
  const thread = await fetchThreadById(props.params.id);
  const { author, _id, threadText, parentId, community, likes, children } =
    JSON.parse(JSON.stringify(thread));
  return (
    <>
      {/* client-side component  */}
      <ThreadCard
        key={_id}
        threadId={_id}
        author={author}
        currentUser={mongoUser}
        children={children}
        community={community || null}
        likes={likes}
        parentId={parentId}
        threadText={threadText}
      />

      <div className="thread-reply-form">
        <ThreadReply
          threadId={_id}
          author={author}
          currentUser={mongoUser}
          children={children}
          community={community || null}
          parentId={parentId}
          threadText={threadText}
        />
      </div>
      {/* <div className="thread-replies">{JSON.stringify(thread.children)}</div> */}
      <div className="thread-replies">
        {children.length
          ? children.map((childThread, idx) => {
              const {
                author,
                _id,
                threadText,
                parentId,
                community,
                likes,
                children,
              } = JSON.parse(JSON.stringify(childThread));
              return (
                // <div className="text-white p-4 bg-gray-800 rounded-2xl">
                //   <div className="flex gap-3 justify-center items-center">
                //     <Image
                //       src={childThread["author"]["image"]}
                //       alt=""
                //       width={23}
                //       height={23}
                //       className="rounded-full self-start"
                //     />
                //     <div className="reply">
                //       <h2 className="text-gray-200 text-sm font-bold ">
                //         Elon Musk
                //       </h2>
                //       <p className="text-sm text-gray-300">
                //         Lorem, Lorem ipsum dolor sit amet, consectetur
                //         adipisicing elit. Suscipit odit illo earum iste minus
                //         quaerat deleniti qui dolorum adipisci obcaecati.
                //         Sapiente aperiam perferendis ea distinctio doloremque
                //         sequi deserunt iste commodi! ipsum dolor.
                //       </p>
                //     </div>
                //   </div>
                // </div>
                <>
                  <ThreadCard
                    key={_id}
                    threadId={_id}
                    author={author}
                    currentUser={mongoUser}
                    parentId={parentId}
                    children={children}
                    community={community || null}
                    likes={likes}
                    threadText={threadText}
                  />
                </>
              );
            })
          : null}
      </div>
    </>
  );
};

export default ThreadPage;
