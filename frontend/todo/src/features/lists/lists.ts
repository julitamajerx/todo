import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ListService } from '../../services/list-service';
import { List } from '../../shared/models/list';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  protected lists: List[] = [];

  ngOnInit(): void {
    this.lists = this.listService.getAllLists();
  }

  private listService = inject(ListService);
  private taskService = inject(TaskService);

  sortByList(list: string) {
    this.taskService.currentList.set(list);
    this.taskService.hideTaskDescription();
  }

  resetLists() {
    this.taskService.currentList.set(null);
    this.taskService.hideTaskDescription();
  }
}
