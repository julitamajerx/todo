import { inject, Injectable, signal } from '@angular/core';
import { Task } from '../shared/models/task';
import { TaskSort } from '../shared/enums/task-sort-enum';
import { HttpClient } from '@angular/common/http';
import { TASK_BY_URL, TASKS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public isSelected = signal(false);
  public selectedTaskId = signal<number>(0);
  public currentSort = signal<TaskSort>(TaskSort.Inbox);
  public currentTag = signal<string | null>(null);
  public currentList = signal<string | null>(null);

  private http = inject(HttpClient);

  private tasks = signal<Task[]>([]);

  constructor() {
    this.http.get<Task[]>(TASKS_URL + '?page=1&limit=15').subscribe((data) => {
      const tasksWithParsedDates = data.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
      this.tasks.set(tasksWithParsedDates);
    });
  }

  getAllTasks(): Task[] {
    return this.tasks();
  }

  getTask(taskId: number) {
    return this.http.get<Task>(TASK_BY_URL + taskId);
  }

  private isActive(task: Task): boolean {
    return !task.isCompleted && !task.isDeleted;
  }

  sortTasks(): Task[] {
    let filtered = this.getAllTasks();
    const tag = this.currentTag();
    const sortBy = this.currentSort();
    const list = this.currentList();

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
    const task = this.tasks().find((task) => task.id === taskId);
    return task?.list?.id ?? null;
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
