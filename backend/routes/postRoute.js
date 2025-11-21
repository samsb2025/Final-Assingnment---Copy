import express from "express";
import Post from "../models/Post.js";
import { VerifyToken } from "../middlewares/VerifyToken.js";
import {
  createPostValidation,
  getPostValidation,
} from "../utils/PostValidation.js";
import { redisClient } from "../utils/redisClient.js";

const router = express.Router();

// GET all posts
router.get("/", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (pageNumber - 1) * limit;
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: pageNumber,
      posts,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: err.message });
  }
});

// GET single post
router.get("/:id", getPostValidation, async (req, res) => {
  try {
    // (1)Check if the post is in the cache /redis
    const cachedPost = await redisClient.get(`post:${req.params.id}`);
    if (cachedPost) {
      return res.json({
        source: "cache",
        data: JSON.parse(cachedPost),
      });
    }
    // check if the post is in the database
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // store the post in the cache
    await redisClient.set(
      `post:${post._id}`,
      JSON.stringify(post),
      "EX",
      60 * 60
    );
    return res.json({
      source: "database",
      data: post,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch post", error: err.message });
  }
});

// CREATE post
router.post("/", VerifyToken, createPostValidation, async (req, res) => {
  try {
    const { title, content, user } = req.body;

    const newPost = await Post.create({
      title,
      content,
      user: req.user.userId,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
});

// UPDATE post
router.put("/:id", VerifyToken, createPostValidation, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // the owner of the post or admin
    if (!post.user.equals(req.user.userId) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    post.title = title;
    post.content = content;
    //delete the cache
    await redisClient.del(`post:${post._id}`);
    await post.save();
    return res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update post", error: err.message });
  }
});

// DELETE post
router.delete("/:id", VerifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.user.equals(req.user.userId) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }
    // delete it
    await post.deleteOne();

    await redisClient.del(`post:${post._id.toString()}`);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
});

export default router;
