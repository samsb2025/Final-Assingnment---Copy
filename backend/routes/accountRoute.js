import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";
import { VerifyToken, isAdmin } from "../middlewares/VerifyToken.js";
import { createAccountValidation } from "../utils/AccountValidation.js";

dotenv.config();

const router = express.Router();

router.post("/login", createAccountValidation, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" }); 
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    // generate token
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //return both token and user data
    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, username, password, role } = req.body;

  try {
    const generatesalt = await bcrypt.genSalt(10);
    const encriptedPassword = await bcrypt.hash(password, generatesalt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: encriptedPassword,
      role: role || "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during registration",
      error: error.message,
    });
  }
});
//Get Current User
router.get("/current-user", VerifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Error fetching current user", error });
  }
});

export default router;
