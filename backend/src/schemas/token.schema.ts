import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TokenType } from './../shared/enums';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Token extends Document {
  @Prop({ required: true })
  email!: string;

  @Prop({ required: true, unique: true })
  token!: string;

  @Prop({ type: String, enum: TokenType, required: true })
  type!: TokenType;

  @Prop({ required: true })
  expiresIn!: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
export type TokenDocument = Token & Document;
