import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../shared/models/tag';
import { TAGS_URL, TAGS_URL_CREATE } from '../shared/constants/urls';
import { CreateTagResponse } from '../shared/interfaces/tag-response.interface';

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

  public createTag(tag: Tag): Observable<CreateTagResponse> {
    return this.http.post<CreateTagResponse>(TAGS_URL_CREATE, tag);
  }
}
