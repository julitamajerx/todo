export interface ActionResponse<T> {
  data: T;
  message?: string;
}

export interface DeleteResponse {
  message?: string;
}
