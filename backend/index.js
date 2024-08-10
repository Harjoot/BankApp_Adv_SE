import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import accountRoutes from "./Routes/Accounts.js";

// Rest of your code remains the same

// ... rest of your code

//express app
const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

mongoose
  .connect(`${process.env.MONGO}`)
  .then(() => {
    //listen for requests
    app.listen(process.env.BACKEND_PORT, () => {
      console.log(`Server listening on port ${process.env.BACKEND_PORT}`);
    });
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/accounts", accountRoutes);
