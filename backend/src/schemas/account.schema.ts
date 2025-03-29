import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true })
export class Account extends Document {
  @Prop({ required: true })
  type!: string;

  @Prop({ required: true })
  provider!: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  accessToken?: string;

  @Prop({ required: true })
  expiresAt!: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  userId!: MongooseSchema.Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
export type AccountDocument = Account & Document;
