import { createClient } from "redis";

export const redisClient = createClient({
  url:process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

export const connectRedis = async () => {
  try {
    
    redisClient.on("connect", () => console.log("Redis Client Connected"));
    redisClient.on("ready", () => console.log("Redis Client Ready"));
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};


