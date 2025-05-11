import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis(this.config.getOrThrow("REDIS_URI"));

    this.client.on("connect", () => {
      console.log("RedisService: Connected to Redis");
    });

    this.client.on("error", (err) => {
      console.error("RedisService: Redis connection error:", err);
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.quit();
      console.log("RedisService: Redis connection closed gracefully");
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set<T>(key: string, value: T, ttl = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), "EX", ttl);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  get clientInstance(): Redis {
    return this.client;
  }
}
