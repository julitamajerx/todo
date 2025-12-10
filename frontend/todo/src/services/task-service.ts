import { inject, Injectable, signal } from '@angular/core';
import { Task } from '../shared/models/task';
import { TaskSort } from '../shared/enums/task-sort-enum';
import { HttpClient } from '@angular/common/http';
import { TASK_BY_URL, TASKS_URL } from '../shared/constants/urls';
import { TasksResponse } from '../shared/interfaces/task-response.interface';

type TaskQueryParams = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public isSelected = signal(false);
  public selectedTaskId = signal<string>('');

  public currentSort = signal<TaskSort>(TaskSort.Inbox);
  public currentTag = signal<string | null>(null);
  public currentList = signal<string | null>(null);

  private http = inject(HttpClient);
  private tasks = signal<Task[]>([]);

  constructor() {
    this.loadTasks();
  }

  private loadTasks(page = 1, limit = 15) {
    const params: TaskQueryParams = {
      page,
      limit,
      sortBy: this.currentSort(),
    };

    const tag = this.currentTag();
    if (tag !== null) params['tag'] = tag;

    const list = this.currentList();
    if (list !== null) params['list'] = list;

    this.http.get<TasksResponse>(TASKS_URL, { params }).subscribe((response) => {
      const mapped = response.tasks.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));

      this.tasks.set(mapped);
    });
  }

  public getAllTasks(): Task[] {
    return this.tasks();
  }

  public getTask(taskId: string) {
    return this.http.get<Task>(TASK_BY_URL + taskId);
  }

  public setTag(tagName: string | null) {
    this.currentTag.set(tagName);
    this.loadTasks();
  }

  public setList(listName: string | null) {
    this.currentList.set(listName);
    this.loadTasks();
  }

  public setSort(sort: TaskSort) {
    this.currentSort.set(sort);
    this.loadTasks();
  }

  public showTaskDescription() {
    this.isSelected.set(true);
  }

  public hideTaskDescription() {
    this.isSelected.set(false);
  }

  public setSelectedTag(taskId: string) {
    this.selectedTaskId.set(taskId);
  }

  public checkDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today;
  }
}
