import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../shared/models/list';
import { LISTS_URL, LISTS_URL_CREATE, LISTS_URL_DELETE } from '../shared/constants/urls';
import {
  CreateListResponse,
  DeleteListResponse,
} from '../shared/interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  public lists = signal<List[]>([]);

  private http = inject(HttpClient);

  public getAllLists() {
    this.http.get<List[]>(LISTS_URL + '?all=true').subscribe({
      next: (lists) => this.lists.set(lists),
      error: (err) => console.log('Error loading lists:', err),
    });
  }

  public createList(list: List): void {
    this.http.post<CreateListResponse>(LISTS_URL_CREATE, list).subscribe({
      next: (response) => {
        this.lists.update((current) => [...current, response.list]);
      },
      error: (err) => console.log('Error creating list:', err),
    });
  }

  public deleteList(listId: string): void {
    this.http.delete<DeleteListResponse>(`${LISTS_URL_DELETE}/${listId}`).subscribe({
      next: () => {
        this.lists.update((current) => current.filter((l) => l._id !== listId));
      },
      error: (err) => console.log('Error deleting list:', err),
    });
  }
}
