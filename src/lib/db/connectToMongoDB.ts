// db.js
import mongoose, { connect, connection } from "mongoose";
import { safeAsyncOperation } from "../utils";
let isConnected = false;
const connectToMongoDB = async () => {
  // // * applying restrictions
  // mongoose.set("strictQuery", true);
  // mongoose.set("strict", true); // schema fields are only allowed
  return await safeAsyncOperation(async () => {
    if (connection.readyState === 0) {
      await connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`!, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      isConnected = true;
    }
    console.log(
      "Connected to MongoDB",
      `${process.env.MONGODB_URI}/${process.env.THREADSMEGAAPP}`,
      isConnected
    );
  });
};

export default connectToMongoDB;
