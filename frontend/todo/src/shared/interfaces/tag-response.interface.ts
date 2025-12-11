import { Tag } from '../models/tag';

export interface CreateTagResponse {
  tag: Tag;
  message?: string;
}

export interface DeleteTagResponse {
  message?: string;
}
