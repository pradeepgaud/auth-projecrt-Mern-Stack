// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URL);
//     // console.log("✅ MongoDB Connected Successfully!");
//     console.log("MongoDB Connected:", mongoose.connection.db.databaseName);
//   } catch (error) {
//     console.log("❌ MongoDB Connection Failed:", error.message);
//     console.log("📌 Error Message:", error.message);
//     // process.exit(1); // Stop the server if DB fails
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URL);
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected:", conn.connection.db.databaseName);
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error.message);
  }
};
export default connectDB;
