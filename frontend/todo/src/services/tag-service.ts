import { Injectable } from '@angular/core';
import { sample_tags } from '../data';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  getAllTags() {
    return sample_tags;
  }
}
