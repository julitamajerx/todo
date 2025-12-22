import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TaskDetails } from './task-details/task-details';
import { TaskService } from '../../services/task-service';
import { Task } from '../../shared/models/task';
import { TasksList } from './tasks-list/tasks-list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasks',
  imports: [TaskDetails, TasksList],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  protected tasks = signal<Task[]>([]);
  protected isSelected = false;
  protected isMobile = false;
  protected taskService = inject(TaskService);

  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.taskService.getAllTasks();

    effect(() => {
      this.isSelected = this.taskService.isSelected();
      this.tasks.set(this.taskService.tasks());
    });
  }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 870px)'])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  protected hide() {
    this.taskService.hideTaskDescription();
  }
}
