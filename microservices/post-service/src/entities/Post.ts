import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Like } from './Like';
import { Comment } from './Comment';
import { PostPrivacy } from '../types/common';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  content: string;

  @Column('uuid')
  ownerId: string;

  @Column({ nullable: true })
  mediaPath: string;

  @Column({ enum: PostPrivacy, default: PostPrivacy.PUBLIC, type: 'enum' })
  privacy: PostPrivacy;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => Post, (post) => post.reposts, { nullable: true, onDelete: 'CASCADE' })
  originalPost: Post;

  @OneToMany(() => Post, (post) => post.originalPost)
  reposts: Post[];

  @Column('boolean', { default: false })
  isRepost: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  updatedAt: Date;
}
