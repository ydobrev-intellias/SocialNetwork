export interface SignUpSchema {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface SignInSchema {
  email: string;
  password: string;
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
