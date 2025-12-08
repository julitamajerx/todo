import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ListService } from '../../services/list-service';
import { List } from '../../shared/models/list';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit, OnDestroy {
  protected lists: List[] = [];

  private destroy = new Subject<void>();
  private listService = inject(ListService);
  private taskService = inject(TaskService);

  ngOnInit(): void {
    const listsObservable: Observable<List[]> = this.listService.getAllLists();

    listsObservable.subscribe((listsDbItem) => {
      this.lists = listsDbItem;
    });
  }

  protected sortByList(list: string) {
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
