import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../shared/models/list';
import { LISTS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private http = inject(HttpClient);

  getAllLists() {
    return this.http.get<List[]>(LISTS_URL);
  }
}
