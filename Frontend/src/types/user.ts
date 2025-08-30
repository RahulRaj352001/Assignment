export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "read-only";
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "read-only";
}

export interface UpdateUserInput {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user" | "read-only";
}
