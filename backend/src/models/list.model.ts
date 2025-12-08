import { Schema, model } from "mongoose";

export interface List {
  id: number;
  name: string;
}

export const ListSchema = new Schema<List>(
  {
    name: { type: String, required: true },
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
