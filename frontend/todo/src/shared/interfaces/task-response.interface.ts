import { Task } from '../models/task';

export interface TasksResponse {
  total: number;
  page: number;
  limit: number;
  tasks: Task[];
}

export interface UpdateTaskPayload {
  _id: string;
  dueDate?: Date;
  description?: string;
  list?: string | null;
  tags?: string[];
}
