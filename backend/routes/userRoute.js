import express from "express";
import User from "../models/User.js";
import { VerifyToken, isAdmin } from "../middlewares/VerifyToken.js";

const router = express.Router();

// Get all users(admin only)
router.get("/", VerifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving users", error });
  }
});

// Get user by ID
router.get("/:id", VerifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving user", error });
  }
});

//Delete user
router.delete("/:id", VerifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting user", error });
  }
});

// Update user
router.put("/:id", VerifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, username } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.username = username;
    await user.save();
    res.send({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error updating user", error });
  }
});

export default router;
