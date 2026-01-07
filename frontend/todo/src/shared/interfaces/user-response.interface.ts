export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  message: string;
}

export interface UserCredentials {
  email: string;
  password?: string;
}
