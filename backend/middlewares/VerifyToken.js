//middlewares/VerifyToken.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

//Authentication middleware
export const VerifyToken = async (req, res, next) => {
  try {
    // token from headers
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded token:", decoded);

    if (!decoded.userId || !decoded.username) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };
    // attach user info
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin check middleware
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};
