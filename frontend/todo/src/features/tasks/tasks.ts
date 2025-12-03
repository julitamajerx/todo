import { Component, effect, inject, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TaskDetails } from './task-details/task-details';
import { TasksList } from './tasks-list/tasks-list';
import { TaskDisplayService } from '../../services/task-display-service';
import { Task } from '../../shared/models/task-model';

@Component({
  selector: 'app-tasks',
  imports: [TaskDetails, TasksList],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  public tasks: Task[] = [];

  protected isSelected = false;
  protected isMobile = false;

  protected taskDisplayService = inject(TaskDisplayService);
  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    effect(() => {
      this.isSelected = this.taskDisplayService.isSelected();

      const sort = this.taskDisplayService.currentSort();
      this.tasks = this.taskDisplayService.sortTasks(sort);
    });
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 870px)']).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  hide() {
    this.taskDisplayService.hideTaskDescription();
  }
}
