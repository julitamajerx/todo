import { Component, effect, inject, input } from '@angular/core';
import { Task } from '../../../shared/models/task';
import { TaskService } from '../../../services/task-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks-list',
  imports: [DatePipe],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
})
export class TasksList {
  public tasks = input<Task[]>();
  protected taskDisplayService = inject(TaskService);
  protected listHeader = '';

  constructor() {
    effect(() => {
      const currentSort = this.taskDisplayService.currentSort();
      this.listHeader = this.capitalize(currentSort);
    });
  }

  showTaskDescription(taskId: number) {
    this.taskDisplayService.setSelectedTag(taskId);
    this.taskDisplayService.showTaskDescription();
  }

  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
