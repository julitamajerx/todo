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
