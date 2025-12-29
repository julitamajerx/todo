import { Schema, Types, model } from "mongoose";

export interface Tag {
  id: number;
  emoji: string;
  name: string;
  user: Types.ObjectId;
}

export const TagSchema = new Schema<Tag>(
  {
    emoji: { type: String, required: true },
    name: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "user", required: true },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const TagModel = model<Tag>("tag", TagSchema);
