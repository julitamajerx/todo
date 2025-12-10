import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../shared/models/tag';
import { TAGS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private http = inject(HttpClient);

  public getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(TAGS_URL);
  }

  public getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(TAGS_URL + '?all=true');
  }
}
