import { Component, inject, OnInit } from '@angular/core';
import { Tag } from '../../../shared/models/tag';
import { TagService } from '../../../services/tag-service';
import { Observable, Subject } from 'rxjs';
import { TaskService } from '../../../services/task-service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
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
export class TagsManagement implements OnInit {
  protected tags: Tag[] = [];
  protected openEmojiPicker = false;
  protected selectedEmoji = '';
  protected newTagName = '';
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

    console.log(this.model);
  }

  openEmojiPickerToggle() {
    this.openEmojiPicker = !this.openEmojiPicker;
  }

  onEmojiSelect(event: any) {
    this.newEmoji = event.emoji.native;
    this.selectedEmoji = this.newEmoji;
    this.openEmojiPicker = false;
    this.model.emoji = this.newEmoji;
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
        console.log('Tag created:', response.tag);

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
        console.log('Tag deleted:', response.message);
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
