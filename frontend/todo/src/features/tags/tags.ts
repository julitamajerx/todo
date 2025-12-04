import { Component, inject, OnInit } from '@angular/core';
import { Tag } from '../../shared/models/tag';
import { TagService } from '../../services/tag-service';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-tags',
  imports: [],
  templateUrl: './tags.html',
  styleUrl: './tags.css',
})
export class Tags implements OnInit {
  protected tags: Tag[] = [];

  private tagService = inject(TagService);
  private taskService = inject(TaskService);

  ngOnInit(): void {
    this.tags = this.tagService.getAllTags();
  }

  sortByTags(tag: string) {
    this.taskService.currentTag.set(tag);
    this.taskService.hideTaskDescription();
  }

  resetTags() {
    this.taskService.currentTag.set(null);
    this.taskService.hideTaskDescription();
  }
}
