
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });
connectDB()
.then(() => {
  app.listen(process.env.PORT || 8001, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

  app.on("error", (error) => {
    console.log("Server crashed abruptly: ", error);
    throw error;
  });
})
.catch((error) => console.error("MONGODB connection failed !!!: ", error));

/*
import express from "express";
// require('dotenv').config({path: '/.env'});  // Load .env file from root directory of the project
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    })

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
})()
*/