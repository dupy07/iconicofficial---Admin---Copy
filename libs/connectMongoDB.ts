import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside Vercel environment settings."
  );
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { bufferCommands: false });

// Connection events
const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.once("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

export default db;
