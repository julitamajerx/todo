import { Tag } from './tag';
import { List } from './list';

export class Task {
  id!: number;
  name!: string;
  description = '';
  dueDate = new Date();
  isCompleted = false;
  isDeleted = false;
  tags?: Tag[];
  list?: List;
}

export interface TasksResponse {
  total: number;
  page: number;
  limit: number;
  tasks: Task[];
}
