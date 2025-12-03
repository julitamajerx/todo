export class Task {
  id!: number;
  name!: string;
  description = '';
  dueDate = new Date();
  isCompleted = false;
}
