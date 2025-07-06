import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole, AuthMethod } from './../shared/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({
    required: function (this: User) {
      return this.method === AuthMethod.CREDENTIALS; // CREDENTIALS == password login
    }
  })
  password?: string;

  @Prop({ required: true })
  displayName!: string;

  @Prop()
  picture?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.REGULAR })
  role!: UserRole;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ default: false })
  isTwoFactorEnabled!: boolean;

  @Prop({ type: String, enum: AuthMethod, required: true })
  method!: AuthMethod;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Account' }] })
  accounts!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
