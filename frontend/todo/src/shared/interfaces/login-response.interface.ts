export interface LoginResponse {
  id: string;
  email: string;
  name: string;
}

export interface UserCredentials {
  email: string;
  password?: string;
}
