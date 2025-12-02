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
  protected isSelected = false; // czy wyświetlać szczegóły
  protected isMobile = false; // tryb mobile

  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    // obserwujemy breakpoint dla handset (telefony)
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;

      // jeśli przechodzimy z mobile → desktop, można przywrócić widok listy
      if (!this.isMobile) {
        this.isSelected = false; // lub true, jeśli chcesz od razu widok desktop
      }
    });
  }

  show() {
    this.isSelected = true;
  }

  hide() {
    this.isSelected = false;
  }
}
