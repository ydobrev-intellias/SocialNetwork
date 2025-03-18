import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';

export const createComment = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { content } = ctx.request.body;
  const { id: ownerId } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const postRepository = AppDataSource.getRepository(Post);
  let post = await postRepository.findOne({
    where: { id: postId },
    relations: ['originalPost'],
  });

  if (!post) {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
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

  await commentRepository.save(comment);

  ctx.status = 201;
  ctx.body = comment;
};

export const getComments = async (ctx: Context) => {
  const { postId } = ctx.params;

  const postRepository = AppDataSource.getRepository(Post);
  let post = await postRepository.findOne({
    where: { id: postId },
    relations: ['comments', 'originalPost'],
  });

  if (!post) {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }

  if (post.isRepost && post.originalPost) {
    post = post.originalPost;
  }

  ctx.status = 200;
  ctx.body = post.comments;
};

export const deleteComment = async (ctx: Context) => {
  const { commentId } = ctx.params;

  const commentRepository = AppDataSource.getRepository(Comment);
  const comment = await commentRepository.findOne({ where: { id: commentId } });

  if (!comment) {
    ctx.status = 404;
    ctx.body = { message: 'Comment not found' };
    return;
  }

  await commentRepository.delete({ id: commentId });

  ctx.status = 204;
  ctx.body = '';
};

export const updateComment = async (ctx: Context) => {
  const { commentId } = ctx.params;
  const { content } = ctx.request.body;

  const commentRepository = AppDataSource.getRepository(Comment);
  const comment = await commentRepository.findOne({ where: { id: commentId } });

  if (!comment) {
    ctx.status = 404;
    ctx.body = { message: 'Comment not found' };
    return;
  }

  comment.content = content;

  await commentRepository.save(comment);

  ctx.status = 201;
  ctx.body = comment;
};
