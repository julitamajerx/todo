import { Component, effect, inject, signal } from '@angular/core';
import { TagService } from '../../../services/tag-service';
import { Tag } from '../../../shared/models/tag';

@Component({
  selector: 'app-add-tags',
  imports: [],
  templateUrl: './add-tags.html',
  styleUrl: './add-tags.css',
})
export class AddTags {
  protected tags = signal<Tag[]>([]);
  protected localSelectedTags = signal<string[]>([]);

  private tagService = inject(TagService);

  constructor() {
    this.tagService.getAllTags();

    effect(
      () => {
        this.tags.set(this.tagService.tags());
        this.localSelectedTags.set(this.tagService.selectedTags());
      },
      { allowSignalWrites: true },
    );
  }

  protected onChange(value: string) {
    const current = this.localSelectedTags();
    if (current.includes(value)) {
      this.localSelectedTags.set(current.filter((id) => id !== value));
    } else {
      this.localSelectedTags.set([...current, value]);
    }
  }

  protected addTags() {
    this.tagService.setSelectedTags(this.localSelectedTags());
  }
}
