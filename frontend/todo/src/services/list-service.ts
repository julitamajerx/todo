import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../shared/models/list';
import { LISTS_URL } from '../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private http = inject(HttpClient);

  public getAllLists(): Observable<List[]> {
    return this.http.get<List[]>(LISTS_URL);
  }
}
