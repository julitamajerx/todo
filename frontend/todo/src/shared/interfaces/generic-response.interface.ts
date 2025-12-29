export interface ActionResponse<T> {
  data: T;
  message?: string;
}

export interface MessageResponse {
  message?: string;
}
