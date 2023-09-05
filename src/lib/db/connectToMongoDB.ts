// db.js
import mongoose, { connect, connection } from "mongoose";
let isConnected = false;
const connectToMongoDB = async () => {
  // // * applying restrictions
  // mongoose.set("strictQuery", true);
  // mongoose.set("strict", true); // schema fields are only allowed
  try {
    if (connection.readyState === 0) {
      await connect(process.env.MONGODB_URI!, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      isConnected = true;
    }
    console.log(
      "Connected to MongoDB",
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // throw new Error("Could not connect to MongoDB");
  }
};

export default connectToMongoDB;
