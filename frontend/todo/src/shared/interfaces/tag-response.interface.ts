import { Tag } from '../models/tag';

export interface CreateTagResponse {
  tag: Tag;
  message?: string;
}
