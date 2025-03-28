import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './User';

@Entity('followers')
@Unique(['follower', 'following'])
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  following: User;
}
