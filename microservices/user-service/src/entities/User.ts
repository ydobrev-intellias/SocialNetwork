import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Contact } from './Contact';
import { Follower } from './Follower';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;
  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];
  @Column({ nullable: true })
  avatarPath: string;
  @Column({ nullable: true })
  coverPath: string;

  @OneToMany(() => Follower, (follower) => follower.following)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.follower)
  following: Follower[];
}
