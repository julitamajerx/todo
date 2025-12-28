import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { TaskSort } from '../../shared/enums/task-sort-enum';
import { Lists } from '../../features/lists/lists';
import { Tags } from '../../features/tags/tags';
import { Tasks } from '../../features/tasks/tasks';
import { User } from '../../features/user/user';

@Component({
  selector: 'app-home',
  imports: [User, Tags, Tasks, Lists],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected taskSort = TaskSort;

  private taskService = inject(TaskService);

  protected sortTask(sortType: TaskSort) {
    this.taskService.setSort(sortType);
    this.taskService.hideTaskDescription();
  }
}
