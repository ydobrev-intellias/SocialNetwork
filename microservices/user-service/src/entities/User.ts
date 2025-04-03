import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Contact } from './Contact';
import { Follow } from './Follow';
import { Role } from '../types/user';

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

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];
}
