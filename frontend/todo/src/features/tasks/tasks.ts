import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TaskDetails } from './task-details/task-details';
import { TasksList } from './tasks-list/tasks-list';

@Component({
  selector: 'app-tasks',
  imports: [TaskDetails, TasksList],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  protected isSelected = true;
  protected isMobile = false;

  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  show() {
    this.isSelected = true;
  }

  hide() {
    this.isSelected = false;
  }
}
