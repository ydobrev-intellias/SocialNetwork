import { User } from './user';

export interface Follow {
  id: string;
  follower: User;
  following: User;
}
