import { inject, Injectable, signal } from '@angular/core';
import { Task } from '../shared/models/task';
import { TaskSort } from '../shared/enums/task-sort-enum';
import { HttpClient } from '@angular/common/http';
import {
  TASK_BY_URL,
  TASK_URL_COMPLETE,
  TASK_URL_CREATE,
  TASK_URL_DELETE,
  TASKS_URL,
} from '../shared/constants/urls';
import {
  CompleteTaskResponse,
  CreateTaskResponse,
  DeleteTaskResponse,
  TasksResponse,
} from '../shared/interfaces/task-response.interface';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

type TaskQueryParams = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public tasks = signal<Task[]>([]);
  public isSelected = signal(false);
  public selectedTaskId = signal<string>('');
  public selectedTask = signal<Task | null>(null);

  public currentSort = signal<TaskSort>(TaskSort.Inbox);
  public currentTag = signal<string | null>(null);
  public currentList = signal<string | null>(null);

  private http = inject(HttpClient);

  constructor() {
    this.setupTaskLoading();
  }

  private setupTaskLoading(): void {
    toObservable(this.selectedTaskId)
      .pipe(
        filter((taskId) => !!taskId),
        switchMap((taskId) => this.getTask(taskId)),
        tap({
          next: (task) => this.selectedTask.set(task),
          error: (err) => {
            console.error('Error fetching selected task:', err);
            this.selectedTask.set(null);
          },
        }),
      )
      .subscribe();
  }

  public getAllTasks(page = 1, limit = 15) {
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

  public getTask(taskId: string): Observable<Task> {
    return this.http.get<Task>(TASK_BY_URL + taskId);
  }

  public setTag(tagName: string | null) {
    this.currentTag.set(tagName);
    this.getAllTasks();
  }

  public setList(listName: string | null) {
    this.currentList.set(listName);
    this.getAllTasks();
  }

  public setSort(sort: TaskSort) {
    this.currentSort.set(sort);
    this.getAllTasks();
  }

  public showTaskDescription() {
    this.isSelected.set(true);
  }

  public hideTaskDescription() {
    this.isSelected.set(false);
    this.selectedTaskId.set('');
  }

  public setSelectedTask(taskId: string) {
    this.selectedTaskId.set(taskId);
    this.isSelected.set(true);
  }

  public createTask(task: Task) {
    this.http.post<CreateTaskResponse>(TASK_URL_CREATE, task).subscribe({
      next: (response) => {
        this.tasks.update((current) => [...current, response.task]);
      },
      error: (err) => console.log('Error creating task:', err),
    });
  }

  public deleteTask(taskId: string) {
    this.http.delete<DeleteTaskResponse>(`${TASK_URL_DELETE}/${taskId}`).subscribe({
      next: () => {
        this.tasks.update((current) => current.filter((t) => t._id !== taskId));
      },
      error: (err) => console.log('Error deleting task:', err),
    });
  }

  public completeTask(taskId: string) {
    this.http.patch<CompleteTaskResponse>(`${TASK_URL_COMPLETE}/${taskId}`, {}).subscribe({
      next: () => {
        this.tasks.update((current) => current.filter((t) => t._id !== taskId));
      },
      error: (err) => console.log('Error completing task:', err),
    });
  }

  public checkDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today;
  }

  public forceTaskRefresh(): void {
    const currentId = this.selectedTaskId();
    if (currentId) {
      this.selectedTaskId.set('');
      this.selectedTaskId.set(currentId);
    }
  }
}
