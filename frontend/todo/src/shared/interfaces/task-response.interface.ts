import { Task } from '../models/task';

export interface TasksResponse {
  total: number;
  page: number;
  limit: number;
  tasks: Task[];
}
