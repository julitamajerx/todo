import { Component, effect, inject, signal } from '@angular/core';
import { Tag } from '../../../shared/models/tag';
import { TagService } from '../../../services/tag-service';
import { TaskService } from '../../../services/task-service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tags-management',
  imports: [PickerComponent, CommonModule, FormsModule],
  templateUrl: './tags-management.html',
  styleUrl: './tags-management.css',
})
export class TagsManagement {
  protected tags = signal<Tag[]>([]);
  protected openEmojiPicker = false;
  protected selectedEmoji = '';
  protected newEmoji = '';
  protected model = new Tag();
  protected submitted = false;

  private tagService = inject(TagService);
  private taskService = inject(TaskService);

  constructor() {
    this.tagService.getAllTags();

    effect(() => {
      this.tags.set(this.tagService.tags());
    });
  }

  openEmojiPickerToggle() {
    this.openEmojiPicker = !this.openEmojiPicker;
  }

  onEmojiSelect(event: EmojiEvent) {
    const emoji = event.emoji.native ?? '';

    this.newEmoji = emoji;
    this.selectedEmoji = emoji;
    this.model.emoji = emoji;
    this.openEmojiPicker = false;
  }

  protected sortByTags(tag: string) {
    this.taskService.setTag(tag);
    this.taskService.hideTaskDescription();
  }

  protected resetTags() {
    this.taskService.setTag(null);
    this.taskService.hideTaskDescription();
  }

  onSubmit() {
    this.submitted = true;

    this.tagService.createTag(this.model);
    this.model = new Tag();
  }

  deleteTag(tagId: string) {
    this.tagService.deleteTag(tagId);
  }
}
