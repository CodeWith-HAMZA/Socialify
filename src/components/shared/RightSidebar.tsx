import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";
import { currentUser } from "@clerk/nextjs";
import { IUserSchema } from "@/lib/models/user.model";

const RightSidebar = async () => {
  const user = await currentUser();
  const mongoUser = await fetchUser(user?.id);

  const data = await fetchUsers(mongoUser?.["_id"], 6, 1, "", "ascending"); // all-users except current-user

  // const users = await fetchUsers()
  return (
    <div className="sticky m-3 top-20 left-0 h-screen text-white flex-col bg-[#121415] hidden lg:flex ml-auto">
      {/* <div className="card h-1/2 w-72 px-4 py-3">
        <h2 className="">Suggested Communities</h2>
        <div className="flex flex-col"></div>
      </div> */}
      <div className="card h-1/2 w-80 px-2 py-3">
        <h2 className="">Suggested Users</h2>
        <div className="flex flex-col mt-4 rounded-lg">
          {data?.users.map((user) => (
            <div className="bg-gray-200/10 rounded-lg px-2">
              <UserCard
                name={user["name"]}
                image={user["image"]}
                userId={user["_id"]}
                mongoUser={mongoUser as IUserSchema}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
