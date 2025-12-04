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
  public currentTag = signal<string | null>(null); //Julitka, wroc tu ~ Julitka z przeszlosci
  public currentList = signal<string | null>(null);

  getAllTasks(): Task[] {
    return sample_tasks;
  }

  getTask(taskId: number): Task {
    return this.getAllTasks().find((task) => task.id === taskId) ?? new Task();
  }

  private isActive(task: Task): boolean {
    return !task.isCompleted && !task.isDeleted;
  }

  sortTasks(): Task[] {
    const tasks = this.getAllTasks();
    const tag = this.currentTag();
    const sortBy = this.currentSort();
    const list = this.currentList();

    let filtered = tasks;

    if (sortBy === TaskSort.Completed) {
      filtered = filtered.filter((task) => task.isCompleted);
    } else if (sortBy === TaskSort.Deleted) {
      filtered = filtered.filter((task) => task.isDeleted);
    } else {
      filtered = filtered.filter((task) => this.isActive(task));

      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      if (sortBy === TaskSort.Today) {
        filtered = filtered.filter(
          (task) => task.dueDate >= startOfToday && task.dueDate < endOfToday,
        );
      } else if (sortBy === TaskSort.Week) {
        filtered = filtered.filter(
          (task) => task.dueDate >= startOfWeek && task.dueDate < endOfWeek,
        );
      }
    }

    if (tag) {
      filtered = filtered.filter((task) => task.tags?.some((t) => t.name === tag));
    }

    if (list) {
      filtered = filtered.filter((task) => task.list?.name === list);
    }

    return filtered;
  }

  getListIdForTask(taskId: number): number | null {
    const task = this.getTask(taskId);
    return task.list?.id ?? null;
  }

  setTag(tagName: string | null) {
    this.currentTag.set(tagName);
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

  setCurrentList(listName: string | null) {
    this.currentList.set(listName);
  }

  checkDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today;
  }
}
