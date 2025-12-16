import { List } from '../models/list';

export interface CreateListResponse {
  list: List;
  message?: string;
}

export interface DeleteListResponse {
  message?: string;
}
