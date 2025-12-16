import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Tag } from '../../shared/models/tag';
import { TagService } from '../../services/tag-service';
import { TaskService } from '../../services/task-service';
import { Observable, Subject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { Dialog as DialogWindow } from '../../core/dialog/dialog';
import { TagsManagement } from '../../core/dialog/tags-management/tags-management';

@Component({
  selector: 'app-tags',
  imports: [TagsManagement],
  templateUrl: './tags.html',
  styleUrl: './tags.css',
})
export class Tags implements OnInit, OnDestroy {
  @ViewChild('dialogContent') dialogContentTemplate!: TemplateRef<unknown>;

  protected tags: Tag[] = [];

  private tagService = inject(TagService);
  private taskService = inject(TaskService);
  private dialog = inject(Dialog);
  private destroy = new Subject<void>();

  ngOnInit(): void {
    const tagsObservable: Observable<Tag[]> = this.tagService.getTags();

    tagsObservable.subscribe({
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

  protected openModal() {
    if (this.dialogContentTemplate) {
      this.dialog.open(DialogWindow, {
        data: {
          title: 'Tags Management',
          contentTemplate: this.dialogContentTemplate,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
