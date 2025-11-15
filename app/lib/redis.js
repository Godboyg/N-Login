import { Redis } from "ioredis";

const Redis_url = process.env.REDIS_URI;

const redis = new Redis(Redis_url);

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error", err));

export default redis;