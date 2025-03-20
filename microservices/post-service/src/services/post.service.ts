import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Post, PostPrivacy } from '../entities/Post';
import { uploadFile } from '../utils/uploadFile';
import { deleteFile } from '../utils/deleteFile';

export const createPost = async (ctx: Context) => {
  const { body } = ctx.request as any;
  const { id: ownerId } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  try {
    const postRepository = AppDataSource.getRepository(Post);
    const newPost = postRepository.create({ ...body, ownerId } as Object);
    await postRepository.save(newPost);

    const { files } = ctx.request as any;
    if (files && files.media) {
      const media = Array.isArray(files.media) ? files.media[0] : files.media;
      const ext = media.filepath.split('.').pop() as string;
      const path = await uploadFile(media.filepath, newPost.id, ext);
      newPost.mediaPath = path;
      await postRepository.save(newPost);
    }

    ctx.status = 201;
    ctx.body = { ...newPost };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Error creating post' };
  }
};

export const getPost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { id: ownerId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({
    where: { id: postId },
    relations: { reposts: true, likes: true, originalPost: true },
  });

  if (!post) {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }

  if (post.privacy === PostPrivacy.PRIVATE && post.ownerId !== ownerId && role !== 'admin') {
    ctx.status = 403;
    ctx.body = { message: 'Unauthorized to view this post' };
    return;
  }

  ctx.status = 200;
  ctx.body = post;
};

export const deletePost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { id: ownerId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({ where: { id: postId } });

  if (!post) {
    ctx.status = 404;
    ctx.body = { message: 'Post not found' };
    return;
  }

  if (post.ownerId !== ownerId && role !== 'admin') {
    ctx.status = 403;
    ctx.body = { message: 'Unauthorized to delete this post' };
    return;
  }

  if (post.mediaPath) {
    try {
      deleteFile(post.mediaPath);
    } catch (err) {
      console.error(`Error deleting file for post ${postId}:`, err);
    }
  }

  await postRepository.delete({ id: postId });

  ctx.status = 204;
  ctx.body = '';
};

export const updatePost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { body } = ctx.request as any;
  const { id: ownerId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({ where: { id: postId } });

  if (!post) {
    ctx.status = 404;
    ctx.body = { message: 'Post does not exist' };
    return;
  }

  if (post.ownerId !== ownerId && role !== 'admin') {
    ctx.status = 403;
    ctx.body = { message: 'Unauthorized to update this post' };
    return;
  }

  await postRepository.save({ ...post, ...body });

  const { files } = ctx.request as any;

  if (files && files.media) {
    const media = Array.isArray(files.media) ? files.media[0] : files.media;
    const ext = media.filepath.split('.').pop() as string;
    const path = await uploadFile(media.filepath, post.id, ext);
    post.mediaPath = path;
    await postRepository.save(post);
  }

  ctx.status = 200;
  ctx.body = { ...post, ...body };
};

export const getActivityWall = async (ctx: Context) => {
  const postRepository = AppDataSource.getRepository(Post);
  const { id: userId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  try {
    let posts;
    if (role === 'admin') {
      posts = await postRepository.find();
    } else if (role === 'user') {
      posts = await postRepository.find({
        where: [{ privacy: PostPrivacy.PUBLIC }, { privacy: PostPrivacy.PRIVATE, ownerId: userId }],
        relations: { reposts: true, likes: true, originalPost: true },
      });
    } else {
      ctx.status = 403;
      ctx.body = { message: 'Unauthorized to access posts' };
      return;
    }

    if (posts.length === 0) {
      ctx.status = 404;
      ctx.body = { message: 'No posts found matching the filter' };
      return;
    }

    ctx.status = 200;
    ctx.body = posts;
  } catch (error) {
    console.error('Error getting activity wall:', error);
    ctx.status = 500;
    ctx.body = { message: 'Error getting activity wall' };
  }
};

export const createRepost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { id: ownerId } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  try {
    const postRepository = AppDataSource.getRepository(Post);

    let originalPost = await postRepository.findOne({
      where: { id: postId },
      relations: { originalPost: true },
    });

    if (!originalPost) {
      ctx.status = 404;
      ctx.body = { message: 'Original post not found' };
      return;
    }

    if (originalPost.isRepost && originalPost.originalPost) {
      originalPost = originalPost.originalPost;
    }

    if (originalPost.privacy === PostPrivacy.PRIVATE && originalPost.ownerId !== ownerId) {
      ctx.status = 403;
      ctx.body = { message: 'Cannot repost a private post' };
      return;
    }
    let repost;

    repost = postRepository.create({
      ownerId,
      originalPost,
      isRepost: true,
    });

    await postRepository.save(repost);

    ctx.status = 201;
    ctx.body = repost;
  } catch (error) {
    console.error('Error creating repost:', error);
    ctx.status = 500;
    ctx.body = { message: 'Error creating repost' };
  }
};
