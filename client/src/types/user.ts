export interface User {
  id: string;
  email: string;
  role: Role;
  username: string;
  avatarPath: string | null;
  coverPath: string | null;
  contacts: Contact[];
  followers: any[];
  following: any[];
}
export interface Contact {
  id: string;
  type: string;
  value: string;
}
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
