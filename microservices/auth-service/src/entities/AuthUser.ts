import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('auth_users')
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({type:"enum",default:Role.USER,enum:Role})
  role: Role;
}
