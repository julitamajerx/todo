import { Component, inject, OnInit } from '@angular/core';
import { Tag } from '../../../shared/models/tag';
import { TagService } from '../../../services/tag-service';
import { Observable, Subject } from 'rxjs';
import { TaskService } from '../../../services/task-service';

@Component({
  selector: 'app-tags-management',
  imports: [],
  templateUrl: './tags-management.html',
  styleUrl: './tags-management.css',
})
export class TagsManagement implements OnInit {
  protected tags: Tag[] = [];

  private tagService = inject(TagService);
  private taskService = inject(TaskService);
  private destroy = new Subject<void>();

  ngOnInit(): void {
    const tagObservable: Observable<Tag[]> = this.tagService.getAllTags();

    tagObservable.subscribe({
      next: (tagsDbItem) => {
        this.tags = tagsDbItem;
      },
      error: (err: Error) => {
        console.log('Error fetching tags:', err.message);
      },
    });
  }

  protected sortByTags(tag: string) {
    this.taskService.setTag(tag);
    this.taskService.hideTaskDescription();
  }

  protected resetTags() {
    this.taskService.setTag(null);
    this.taskService.hideTaskDescription();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
