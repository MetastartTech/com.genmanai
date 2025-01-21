import "dotenv/config";
import mongoose from "mongoose";
import initializeFBApp from "./config/firebase";
import server from "./app";

mongoose.connection.once("open", () => {
  console.log("Mongodb connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error("Error in connection to mongoose", err);
});

const startApp = async () => {
  let uri = process.env.MONGODB_URI || "";
  await mongoose.connect(uri);
  initializeFBApp();
  server();
};

startApp();
