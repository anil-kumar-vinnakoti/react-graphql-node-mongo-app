import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.DB_URI);
  console.log("connected to MONGO_DB");
};

export default connectDB;
