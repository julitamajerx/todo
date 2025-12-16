import { Component, inject } from '@angular/core';
import { ListService } from '../../../services/list-service';
import { Subject, Observable } from 'rxjs';
import { TaskService } from '../../../services/task-service';
import { List } from '../../../shared/models/list';
import { FormsModule } from '@angular/forms';
import {
  CreateListResponse,
  DeleteListResponse,
} from '../../../shared/interfaces/list-response.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-management',
  imports: [FormsModule, CommonModule],
  templateUrl: './list-management.html',
  styleUrl: './list-management.css',
})
export class ListManagement {
  protected lists: List[] = [];
  protected submitted = false;
  protected model = new List();

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

  onSubmit() {
    this.submitted = true;

    this.listService.createList(this.model).subscribe({
      next: (response: CreateListResponse) => {
        console.log('List created:', response.list);

        this.lists.push(response.list);
        this.model = new List();
      },
      error: (err) => {
        console.log('Error creating list:', err);
      },
    });
  }

  deleteList(listId: string) {
    this.listService.deleteList(listId).subscribe({
      next: (response: DeleteListResponse) => {
        console.log('List deleted:', response.message);
        this.lists = this.lists.filter((list) => list._id !== listId);
      },
      error: (err) => {
        console.log('Error deleting List:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
