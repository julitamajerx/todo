import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../shared/models/tag';
import { TAGS_URL, TAGS_URL_CREATE, TAGS_URL_DELETE } from '../shared/constants/urls';
import { CreateTagResponse, DeleteTagResponse } from '../shared/interfaces/tag-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  public tags = signal<Tag[]>([]);

  private http = inject(HttpClient);

  public getAllTags() {
    this.http.get<Tag[]>(TAGS_URL + '?all=true').subscribe({
      next: (tags) => this.tags.set(tags),
      error: (err) => console.log('Error loading tags:', err),
    });
  }

  public createTag(tag: Tag) {
    this.http.post<CreateTagResponse>(TAGS_URL_CREATE, tag).subscribe({
      next: (response) => {
        this.tags.update((current) => [...current, response.tag]);
      },
      error: (err) => console.log('Error creating tag:', err),
    });
  }

  public deleteTag(tagId: string) {
    this.http.delete<DeleteTagResponse>(`${TAGS_URL_DELETE}/${tagId}`).subscribe({
      next: () => {
        this.tags.update((current) => current.filter((t) => t._id !== tagId));
      },
      error: (err) => console.log('Error deleting tag:', err),
    });
  }
}
