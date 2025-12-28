import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../shared/models/tag';
import { TAGS_URL, TAGS_URL_CREATE, TAGS_URL_DELETE } from '../shared/constants/urls';
import { TaskService } from './task-service';
import { ActionResponse, DeleteResponse } from '../shared/interfaces/generic-response.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  public tags = signal<Tag[]>([]);
  public selectedTags = signal<string[]>([]);

  private http = inject(HttpClient);
  private taskService = inject(TaskService);
  private toastr = inject(ToastrService);

  public getAllTags() {
    this.http.get<Tag[]>(TAGS_URL + '?all=true').subscribe({
      next: (tags) => this.tags.set(tags),
      error: (err) => console.log('Error loading tags:', err),
    });
  }

  public setSelectedTags(tags: string[]) {
    this.selectedTags.set(tags);
  }

  public createTag(tag: Tag) {
    this.http.post<ActionResponse<Tag>>(TAGS_URL_CREATE, tag).subscribe({
      next: (response) => {
        this.tags.update((current) => [...current, response.data]);
        this.toastr.success(response.message, 'Tag');
      },
      error: (err) => this.toastr.error(err.message, 'Tag'),
    });
  }

  public deleteTag(tagId: string) {
    this.http.delete<DeleteResponse>(`${TAGS_URL_DELETE}/${tagId}`).subscribe({
      next: () => {
        this.tags.update((current) => current.filter((t) => t._id !== tagId));
        this.taskService.forceTaskRefresh();
        this.toastr.success('Tag successfully deleted.', 'Tag');
      },
      error: (err) => this.toastr.error(err.message, 'Tag'),
    });
  }
}
