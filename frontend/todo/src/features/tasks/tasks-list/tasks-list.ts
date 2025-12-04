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
  protected taskService = inject(TaskService);
  protected listHeader = '';
  protected tagName = '';

  constructor() {
    effect(() => {
      const currentSort = this.taskService.currentSort();
      this.listHeader = this.capitalize(currentSort);

      this.tagName = this.taskService.currentTag() || '';
    });
  }

  showTaskDescription(taskId: number) {
    this.taskService.setSelectedTag(taskId);
    this.taskService.showTaskDescription();
  }

  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
