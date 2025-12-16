import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Tag } from '../../../shared/models/tag';
import { TagService } from '../../../services/tag-service';
import { Observable, Subject } from 'rxjs';
import { TaskService } from '../../../services/task-service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CreateTagResponse,
  DeleteTagResponse,
} from '../../../shared/interfaces/tag-response.interface';

@Component({
  selector: 'app-tags-management',
  imports: [PickerComponent, CommonModule, FormsModule],
  templateUrl: './tags-management.html',
  styleUrl: './tags-management.css',
})
export class TagsManagement implements OnInit, OnDestroy {
  protected tags: Tag[] = [];
  protected openEmojiPicker = false;
  protected selectedEmoji = '';
  protected newEmoji = '';
  protected model = new Tag();
  protected submitted = false;

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

    this.tagService.createTag(this.model).subscribe({
      next: (response: CreateTagResponse) => {
        this.tags.push(response.tag);
        this.model = new Tag();
        this.openEmojiPicker = false;
      },
      error: (err) => {
        console.log('Error creating tag:', err);
      },
    });
  }

  deleteTag(tagId: string) {
    this.tagService.deleteTag(tagId).subscribe({
      next: (response: DeleteTagResponse) => {
        console.log(response);
        this.tags = this.tags.filter((tag) => tag._id !== tagId);
      },
      error: (err) => {
        console.log('Error deleting tag:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
