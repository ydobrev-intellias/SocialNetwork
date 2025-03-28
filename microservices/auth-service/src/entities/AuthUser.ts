import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../types/authUser';

@Entity('auth_users')
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;
}
