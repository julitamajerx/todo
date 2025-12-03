import { Injectable, signal } from '@angular/core';
import { Task } from '../shared/models/task-model';
import { sample_tasks } from '../data';

@Injectable({
  providedIn: 'root',
})
export class TaskDisplayService {
  public isSelected = signal(false);
  public selectedTaskId = signal<number>(0);
  getAllTasks(): Task[] {
    return sample_tasks;
  }

  getTask(taskId: number): Task {
    return this.getAllTasks().find((task) => task.id == taskId) ?? new Task();
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
}
