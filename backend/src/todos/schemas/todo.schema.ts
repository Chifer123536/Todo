import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "@/schemas/user.schema";

@Schema({ timestamps: true })
export class Todo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

// Индексы для ускорения запросов
TodoSchema.index({ userId: 1 });
TodoSchema.index({ completed: 1 });
