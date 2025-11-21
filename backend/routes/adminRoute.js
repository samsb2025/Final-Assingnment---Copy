import mongoose from "mongoose";
import express from "express";
import User from "../models/User.js";
import { VerifyToken, isAdmin } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.put("/promote/:id", VerifyToken, isAdmin, async (req, res) => {
  try {
const userId = req.params.id;
    
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot promote yourself" });
      
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: `${user.username} is now an admin` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error promoting user", error: err.message });
  }
});

export default router;
