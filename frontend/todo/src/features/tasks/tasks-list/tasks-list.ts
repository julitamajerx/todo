import { Component, effect, inject, input } from '@angular/core';
import { Task } from '../../../shared/models/task';
import { TaskService } from '../../../services/task-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks-list',
  imports: [DatePipe, FormsModule],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
})
export class TasksList {
  public tasks = input<Task[]>();
  protected taskService = inject(TaskService);
  protected listHeader = '';
  protected tagName = '';
  protected listName = '';
  protected model = new Task();
  protected submitted = false;

  constructor() {
    effect(() => {
      const currentSort = this.taskService.currentSort();
      this.listHeader = this.capitalize(currentSort);

      this.tagName = this.taskService.currentTag() || '';
      this.listName = this.taskService.currentList() || '';
    });
  }

  protected onSubmit() {
    this.submitted = true;

    this.taskService.createTask(this.model);
    this.model = new Task();
  }

  protected showTaskDescription(taskId: string) {
    this.taskService.setSelectedTask(taskId);
    this.taskService.showTaskDescription();
  }

  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
