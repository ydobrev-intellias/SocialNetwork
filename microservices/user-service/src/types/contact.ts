export interface CreateContactSchema {
  type: Type;
  value: string;
}
export interface UpdateContactSchema {
  type: Type;
  value: string;
}
export enum Type {
  PHONE = 'phone',
  LINKEDIN = 'linkedin',
}
