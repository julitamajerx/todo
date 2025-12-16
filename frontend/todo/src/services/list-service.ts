import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../shared/models/list';
import { LISTS_URL, LISTS_URL_CREATE, LISTS_URL_DELETE } from '../shared/constants/urls';
import { Observable } from 'rxjs';
import {
  CreateListResponse,
  DeleteListResponse,
} from '../shared/interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private http = inject(HttpClient);

  public getLists(): Observable<List[]> {
    return this.http.get<List[]>(LISTS_URL);
  }

  public getAllLists(): Observable<List[]> {
    return this.http.get<List[]>(LISTS_URL + '?all=true');
  }

  public createList(list: List): Observable<CreateListResponse> {
    return this.http.post<CreateListResponse>(LISTS_URL_CREATE, list);
  }

  public deleteList(listId: string): Observable<DeleteListResponse> {
    return this.http.delete<DeleteListResponse>(`${LISTS_URL_DELETE}/${listId}`);
  }
}
