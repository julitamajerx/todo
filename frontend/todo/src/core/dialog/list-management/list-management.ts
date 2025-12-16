import { Component, effect, inject, signal } from '@angular/core';
import { ListService } from '../../../services/list-service';
import { TaskService } from '../../../services/task-service';
import { List } from '../../../shared/models/list';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-management',
  imports: [FormsModule, CommonModule],
  templateUrl: './list-management.html',
  styleUrl: './list-management.css',
})
export class ListManagement {
  protected lists = signal<List[]>([]);
  protected submitted = false;
  protected model = new List();

  private listService = inject(ListService);
  private taskService = inject(TaskService);

  constructor() {
    this.listService.getAllLists();

    effect(() => {
      this.lists.set(this.listService.lists());
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

  onSubmit() {
    this.submitted = true;

    this.listService.createList(this.model);
    this.model = new List();
  }

  deleteList(listId: string) {
    this.listService.deleteList(listId);
  }
}
