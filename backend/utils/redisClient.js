import { createClient } from "redis";

export const redisClient = createClient({
  url:process.env.REDIS_URL || "rediss://default:AZ0qAAIncDIyMTI2NWU1NGZlNjA0OGM2ODI1YmViZmM3OTRiNzczM3AyNDAyMzQ@deciding-clam-40234.upstash.io:6379",
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
