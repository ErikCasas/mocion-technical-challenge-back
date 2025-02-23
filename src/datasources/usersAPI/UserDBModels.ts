import { UserModel } from "../../models/UserModel";
import mongoose, { Document, Schema } from "mongoose";

export type UserDB = UserModel & Document<string>;

const userDBSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, lowercase: true },
    nickname: { type: String, required: true, lowercase: true },
    password: { type: String, required: true, select: false },
    favoriteComicsIds: { type: [mongoose.Types.ObjectId], required: true },
  },
  { timestamps: true }
);

userDBSchema.index({ name: 1 });

export const UserDBModel = mongoose.model<UserDB>("users", userDBSchema);
