import { Component, inject, OnInit } from '@angular/core';
import { Tag } from '../../shared/models/tag';
import { TagService } from '../../services/tag-service';

@Component({
  selector: 'app-tags',
  imports: [],
  templateUrl: './tags.html',
  styleUrl: './tags.css',
})
export class Tags implements OnInit {
  protected tags: Tag[] = [];

  private tagService = inject(TagService);

  ngOnInit(): void {
    this.tags = this.tagService.getAllTags();
  }
}
