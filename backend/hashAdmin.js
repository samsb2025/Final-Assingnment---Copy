// hashAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Get the admin's password
    const password = process.env.ADMIN_DEFAULT_PASSWORD;

    if (!password) {
      console.error("ADMIN_DEFAULT_PASSWORD environment variable is not set.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);

    //update admin's password
    const result = await User.updateOne(
      { email: "admin@gmail.com" },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      console.log("Admin password hashed successfully!");
    } else {
      console.log(" No user found with that email.");
    }

    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();
