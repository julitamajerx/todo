import { Schema, Types, model } from "mongoose";

export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  isDeleted: boolean;
  list: Types.ObjectId;
  tags: Types.ObjectId[];
  user: Types.ObjectId;
}

export const TaskSchema = new Schema<Task>(
  {
    name: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    isCompleted: { type: Boolean },
    isDeleted: { type: Boolean },
    list: { type: Types.ObjectId, ref: "list" },
    tags: [{ type: Types.ObjectId, ref: "tag" }],
    user: { type: Types.ObjectId, ref: "user", required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const TaskModel = model<Task>("task", TaskSchema);
