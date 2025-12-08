import { Schema, model, Types } from "mongoose";

export interface TaskTag {
  taskId: Types.ObjectId;
  tagId: Types.ObjectId;
}

const TaskTagSchema = new Schema<TaskTag>(
  {
    taskId: { type: Types.ObjectId, ref: "Task", required: true },
    tagId: { type: Types.ObjectId, ref: "Tag", required: true },
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

export const TaskTagModel = model<TaskTag>("TaskTag", TaskTagSchema);
