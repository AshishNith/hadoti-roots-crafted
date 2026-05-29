import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hadoti_farms";
    console.log(`Connecting to MongoDB at: ${connStr}...`);
    
    const conn = await mongoose.connect(connStr);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
