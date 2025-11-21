import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import accountRoute from "./routes/accountRoute.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import { VerifyToken } from "./middlewares/VerifyToken.js";
import adminRoute from "./routes/adminRoute.js";

import rateLimit from "express-rate-limit";

import { redisClient, connectRedis } from "./utils/redisClient.js";

const app = express();
app.use(express.json());

await connectRedis();
console.log("Connected to Redis");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after an hour",
});
app.use(limiter);

app.use("/api/account", accountRoute);

//to all routes
app.use(VerifyToken);

app.use("/api/admin", adminRoute);

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
