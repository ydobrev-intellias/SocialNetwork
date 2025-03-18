import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

export enum Type {
  PHONE = 'phone',
  LINKEDIN = 'linkedin',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'enum', enum: Type })
  type: Type;
  @Column()
  value: string;
  @ManyToOne(() => User, (user) => user.contacts)
  user: User;
}
