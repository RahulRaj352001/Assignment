export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'read-only';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
