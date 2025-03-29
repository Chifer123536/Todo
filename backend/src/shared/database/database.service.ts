import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit(): Promise<void> {
    if (this.connection.readyState === 1) {
      console.log("Connected to MongoDB");
    } else {
      console.log("Failed to connect to MongoDB");
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection.close();
    console.log("Disconnected from MongoDB");
  }
}
