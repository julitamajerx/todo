import { Schema, Types, model } from "mongoose";

export interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  isDeleted: boolean;
  list: Types.ObjectId;
  tags: Schema.Types.ObjectId[];
}

export const TaskSchema = new Schema<Task>(
  {
    name: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    isCompleted: { type: Boolean },
    isDeleted: { type: Boolean },
    list: { type: Schema.Types.ObjectId, ref: "List" },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
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

export const TaskModel = model<Task>("task", TaskSchema);
