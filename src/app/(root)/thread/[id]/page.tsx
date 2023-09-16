import { fetchThreadById } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

const ThreadPage = async (props) => {
  const user = await currentUser();
  console.log(props.params.id!);
  const thread = await fetchThreadById(props.params.id);
  //   console.log(thread);
  return <>thread page</>;
};

export default ThreadPage;
