import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  if (!process.env.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is not defined");
  }
  const db = await mongoose.connect(process.env.MONGO_DB_URI);

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
