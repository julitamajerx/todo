import { Component, inject, input } from '@angular/core';
import { Task } from '../../../shared/models/task-model';
import { TaskDisplayService } from '../../../services/task-display-service';

@Component({
  selector: 'app-tasks-list',
  imports: [],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
})
export class TasksList {
  public tasks = input<Task[]>();
  protected taskDisplayService = inject(TaskDisplayService);

  showTaskDescription(taskId: number) {
    this.taskDisplayService.setSelectedTag(taskId);
    this.taskDisplayService.showTaskDescription();
  }
}
