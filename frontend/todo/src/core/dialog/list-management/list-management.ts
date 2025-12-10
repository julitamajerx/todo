import { Component, inject } from '@angular/core';
import { ListService } from '../../../services/list-service';
import { Subject, Observable } from 'rxjs';
import { TaskService } from '../../../services/task-service';
import { List } from '../../../shared/models/list';

@Component({
  selector: 'app-list-management',
  imports: [],
  templateUrl: './list-management.html',
  styleUrl: './list-management.css',
})
export class ListManagement {
  protected lists: List[] = [];

  private listService = inject(ListService);
  private taskService = inject(TaskService);
  private destroy = new Subject<void>();

  ngOnInit(): void {
    const listObservable: Observable<List[]> = this.listService.getAllLists();

    listObservable.subscribe({
      next: (listsDbItem) => {
        this.lists = listsDbItem;
      },
      error: (err: Error) => {
        console.log('Error fetching lists:', err.message);
      },
    });
  }

  protected sortByLists(list: string) {
    this.taskService.setList(list);
    this.taskService.hideTaskDescription();
  }

  protected resetLists() {
    this.taskService.setList(null);
    this.taskService.hideTaskDescription();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
