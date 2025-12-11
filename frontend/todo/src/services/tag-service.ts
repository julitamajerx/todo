import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../shared/models/tag';
import { TAGS_URL, TAGS_URL_CREATE, TAGS_URL_DELETE } from '../shared/constants/urls';
import { CreateTagResponse, DeleteTagResponse } from '../shared/interfaces/tag-response.interface';

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

  public deleteTag(tagId: string): Observable<DeleteTagResponse> {
    return this.http.delete<DeleteTagResponse>(`${TAGS_URL_DELETE}/${tagId}`);
  }
}
