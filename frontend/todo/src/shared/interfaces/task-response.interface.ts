import { Task } from '../models/task';

export interface TasksResponse {
  total: number;
  page: number;
  limit: number;
  tasks: Task[];
}

export interface CreateTaskResponse {
  task: Task;
  message?: string;
}

export interface DeleteTaskResponse {
  message?: string;
}

export interface CompleteTaskResponse {
  task: Task;
  message?: string;
}

export interface UpdateTaskResponse {
  task: Task;
  message?: string;
}

export interface UpdateTaskPayload {
  _id: string;
  dueDate?: Date;
  description?: string;
  list?: string | null;
  tags?: string[];
}
