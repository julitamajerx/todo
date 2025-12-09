import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TaskDetails } from './task-details/task-details';
import { TaskService } from '../../services/task-service';
import { Task } from '../../shared/models/task';
import { TasksList } from './tasks-list/tasks-list';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tasks',
  imports: [TaskDetails, TasksList],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit, OnDestroy {
  protected tasks: Task[] = [];
  protected isSelected = false;
  protected isMobile = false;
  protected taskService = inject(TaskService);

  private destroy = new Subject<void>();
  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    effect(() => {
      this.isSelected = this.taskService.isSelected();

      this.tasks = this.taskService.getAllTasks();
    });
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 870px)']).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  protected hide() {
    this.taskService.hideTaskDescription();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
