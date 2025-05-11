import Redis from "ioredis";
import { config } from "dotenv";

config();

export const redisClient = new Redis(process.env.REDIS_URI!);
