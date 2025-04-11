import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import axios from 'axios';
import { config } from '../../config';
import { CommentsWithOwnerProfile } from '../types/comment';
import { produceMessages } from '../rabbitmq/producer';

export const createComment = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { content } = ctx.request.body as any;
  const { id: ownerId } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const postRepository = AppDataSource.getRepository(Post);
  let post = await postRepository.findOne({
    where: { id: postId },
    relations: ['originalPost'],
  });

  if (!post) {
    ctx.throw(404, 'Post not found');
  }

  if (post.isRepost && post.originalPost) {
    post = post.originalPost;
  }

  const commentRepository = AppDataSource.getRepository(Comment);
  const comment = commentRepository.create({
    content,
    post,
    ownerId,
  });
  const commenterProfileResponse = await axios.get(`${config.userServiceUrl}/${ownerId}`, {
    withCredentials: true,
  });

  const createdComment = await commentRepository.save(comment);

  produceMessages('ownerNotifications', {
    content: `${commenterProfileResponse.data.username} commented on this post`,
    targetId: post.id,
    ownerId: post.ownerId,
    createdAt: createdComment.createdAt,
  });

  return createComment;
};

export const getComments = async (ctx: Context) => {
  const { postId } = ctx.params;

  const postRepository = AppDataSource.getRepository(Post);
  let post: Post | null = await postRepository.findOne({
    where: { id: postId },
    relations: ['comments', 'originalPost'],
  });
  console.log('Comments post', post);

  if (!post) {
    ctx.throw(404, 'Post not found');
  }

  if (post.isRepost && post.originalPost) {
    post = post.originalPost;
  }
  const comments: CommentsWithOwnerProfile[] = post.comments;

  if (comments?.length > 0) {
    for (let comment of comments) {
      const ownerProfileResponse = await axios.get(`${config.userServiceUrl}/${comment.ownerId}`, {
        withCredentials: true,
      });
      console.log('Comments service owner response', ownerProfileResponse);
      comment.ownerProfile = ownerProfileResponse.data;
    }
  }

  return comments;
};

export const deleteComment = async (ctx: Context) => {
  const { commentId } = ctx.params;
  const { id: ownerId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const commentRepository = AppDataSource.getRepository(Comment);
  const comment = await commentRepository.findOne({ where: { id: commentId } });

  if (!comment) {
    ctx.throw(404, 'Comment not found');
  }

  if (comment.ownerId !== ownerId && role !== 'admin') {
    ctx.throw(403, 'Unauthorized to delete this post');
  }

  await commentRepository.delete({ id: commentId });
};

export const updateComment = async (ctx: Context) => {
  const { commentId } = ctx.params;
  const { content } = ctx.request.body as any;
  const { id: ownerId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const commentRepository = AppDataSource.getRepository(Comment);
  const comment = await commentRepository.findOne({ where: { id: commentId } });

  if (!comment) {
    ctx.throw(404, 'Comment not found');
  }

  if (comment.ownerId !== ownerId && role !== 'admin') {
    ctx.throw(403, 'Unauthorized to delete this post');
  }

  comment.content = content;

  await commentRepository.save(comment);

  return comment;
};
