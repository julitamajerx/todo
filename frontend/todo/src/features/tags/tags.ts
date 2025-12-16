import { Component, computed, effect, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { Tag } from '../../shared/models/tag';
import { TagService } from '../../services/tag-service';
import { TaskService } from '../../services/task-service';
import { Dialog } from '@angular/cdk/dialog';
import { Dialog as DialogWindow } from '../../core/dialog/dialog';
import { TagsManagement } from '../../core/dialog/tags-management/tags-management';

@Component({
  selector: 'app-tags',
  imports: [TagsManagement],
  templateUrl: './tags.html',
  styleUrl: './tags.css',
})
export class Tags {
  @ViewChild('dialogContent') dialogContentTemplate!: TemplateRef<unknown>;

  protected tags = signal<Tag[]>([]);

  private tagService = inject(TagService);
  private taskService = inject(TaskService);
  private dialog = inject(Dialog);

  constructor() {
    this.tagService.getAllTags();

    const sidebarTags = computed(() => this.tagService.tags().slice(0, 3));

    effect(() => {
      this.tags.set(sidebarTags());
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
}
