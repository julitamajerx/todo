import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../shared/models/list';
import { LISTS_URL, LISTS_URL_CREATE, LISTS_URL_DELETE } from '../shared/constants/urls';
import { ActionResponse, DeleteResponse } from '../shared/interfaces/generic-response.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  public lists = signal<List[]>([]);

  private http = inject(HttpClient);
  private toastr = inject(ToastrService);

  public getAllLists() {
    this.http.get<List[]>(LISTS_URL + '?all=true').subscribe({
      next: (lists) => this.lists.set(lists),
      error: (err) => console.log('Error loading lists:', err),
    });
  }

  public createList(list: List): void {
    this.http.post<ActionResponse<List>>(LISTS_URL_CREATE, list).subscribe({
      next: (response) => {
        this.lists.update((current) => [...current, response.data]);
        this.toastr.success(response.message, 'List');
      },
      error: (err) => this.toastr.error(err.message, 'List'),
    });
  }

  public deleteList(listId: string): void {
    this.http.delete<DeleteResponse>(`${LISTS_URL_DELETE}/${listId}`).subscribe({
      next: () => {
        this.lists.update((current) => current.filter((l) => l._id !== listId));
        this.toastr.success('List successfully deleted.', 'List');
      },
      error: (err) => this.toastr.error(err.message, 'List'),
    });
  }
}
