import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from '../features/user/user';
import { Tags } from '../features/tags/tags';
import { Tasks } from '../features/tasks/tasks';
import { TaskService } from '../services/task-service';
import { TaskSort } from '../shared/enums/task-sort-enum';
import { Lists } from '../features/lists/lists';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, User, Tags, Tasks, Lists],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('todo');
  protected taskSort = TaskSort;
  private taskService = inject(TaskService);

  sortTask(sortType: TaskSort) {
    this.taskService.setSort(sortType);
    this.taskService.hideTaskDescription();
  }
}
