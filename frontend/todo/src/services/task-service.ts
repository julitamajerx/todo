import { Injectable, signal } from '@angular/core';
import { Task } from '../shared/models/task';
import { sample_tasks } from '../data';
import { TaskSort } from '../shared/enums/task-sort-enum';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public isSelected = signal(false);
  public selectedTaskId = signal<number>(0);
  public currentSort = signal<TaskSort>(TaskSort.Inbox);

  getAllTasks(): Task[] {
    return sample_tasks;
  }

  getTask(taskId: number): Task {
    return this.getAllTasks().find((task) => task.id == taskId) ?? new Task();
  }

  sortTasks(sortBy: TaskSort): Task[] {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const tasks = this.getAllTasks();

    switch (sortBy) {
      case TaskSort.Today:
        return tasks.filter(
          (task) =>
            task.dueDate >= startOfToday &&
            task.dueDate < endOfToday &&
            task.isCompleted === false &&
            task.isDeleted === false,
        );

      case TaskSort.Week:
        return tasks.filter(
          (task) =>
            task.dueDate >= startOfWeek &&
            task.dueDate < endOfWeek &&
            task.isCompleted === false &&
            task.isDeleted === false,
        );

      case TaskSort.Completed:
        return tasks.filter((task) => task.isCompleted === true);

      case TaskSort.Deleted:
        return tasks.filter((task) => task.isDeleted === true);

      case TaskSort.Inbox:
      default:
        return tasks.filter((task) => task.isCompleted === false && task.isDeleted === false);
    }
  }

  showTaskDescription() {
    this.isSelected.set(true);
  }

  hideTaskDescription() {
    this.isSelected.set(false);
  }

  setSelectedTag(taskId: number) {
    this.selectedTaskId.set(taskId);
  }

  checkDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today;
  }
}
