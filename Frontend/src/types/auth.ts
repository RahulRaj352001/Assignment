export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}
