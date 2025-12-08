import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Tag } from '../../shared/models/tag';
import { TagService } from '../../services/tag-service';
import { TaskService } from '../../services/task-service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-tags',
  imports: [],
  templateUrl: './tags.html',
  styleUrl: './tags.css',
})
export class Tags implements OnInit, OnDestroy {
  protected tags: Tag[] = [];

  private tagService = inject(TagService);
  private taskService = inject(TaskService);
  private destroy = new Subject<void>();

  ngOnInit(): void {
    const tagsObservable: Observable<Tag[]> = this.tagService.getAllTags();

    tagsObservable.subscribe((tagsDbItem) => {
      this.tags = tagsDbItem;
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
