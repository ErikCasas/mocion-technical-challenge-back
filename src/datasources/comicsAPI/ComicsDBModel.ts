import mongoose, { Document, Schema } from "mongoose";
import { ComicModel } from "../../models/ComicModel";

export type ComicDB = ComicModel & Document<string>;

const ComicDBSchema = new Schema(
  {
    name: { type: String, required: true },
    person_credits: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    issue_number: { type: Number, required: true },
    cover_date: { type: Date, required: true },
    volume: { type: Number, required: true },
    publisher: { type: String, required: true },
  },
  { timestamps: true }
);

export const comicDBModel = mongoose.model<ComicDB>("comic", ComicDBSchema);
