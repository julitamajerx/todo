import { Component, inject, signal, effect } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TaskDetails } from './task-details/task-details';
import { TaskService } from '../../services/task-service';
import { TasksList } from './tasks-list/tasks-list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task } from '../../shared/models/task';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskDetails, TasksList],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  protected taskService = inject(TaskService);
  private breakpointObserver = inject(BreakpointObserver);

  protected tasks = signal<Task[]>([]);
  protected isSelected = signal(false);
  protected isMobile = signal(false);

  constructor() {
    this.taskService.getAllTasks();

    this.breakpointObserver
      .observe(['(max-width: 870px)'])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });

    effect(() => {
      this.isSelected.set(this.taskService.isSelected());
      this.tasks.set(this.taskService.tasks());
    });
  }

  protected hide() {
    this.taskService.hideTaskDescription();
  }
}
