import { Schema, Types, model } from "mongoose";

export interface List {
  id: number;
  name: string;
  user: Types.ObjectId;
}

export const ListSchema = new Schema<List>(
  {
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

export const ListModel = model<List>("list", ListSchema);
