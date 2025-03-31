import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { uploadFile } from '../utils/uploadFile';
import { deleteFile } from '../utils/deleteFile';
import axios from 'axios';
import { Like } from '../entities/Like';
import { Comment } from '../entities/Comment';
import { PostPrivacy } from '../types/common';

export const createPost = async (ctx: Context) => {
  const body = ctx.request.body as Post;
  console.log('body', body);
  const { id: ownerId, username: ownerUsername } = JSON.parse(
    ctx.headers['x-auth-user-data'] as string,
  );
  console.log('CREATE POST AFTER JSON PARSE');

  const postRepository = AppDataSource.getRepository(Post);
  const newPost = postRepository.create({ ...body, ownerId } as Object);
  await postRepository.save(newPost);

  const { files } = ctx.request as any;
  if (files && files.file) {
    const media = Array.isArray(files.file) ? files.file[0] : files.file;
    const ext = media.filepath.split('.').pop() as string;
    const path = await uploadFile(media.filepath, newPost.id, ext);
    newPost.mediaPath = path;
    await postRepository.save(newPost);
  }

  return newPost;
};

export const getPost = async (ctx: Context) => {
  const { postId } = ctx.params;

  const postRepository = AppDataSource.getRepository(Post);
  const post: any = await postRepository.findOne({
    where: { id: postId },
    relations: { reposts: true, likes: true, originalPost: true, comments: true },
  });

  if (!post) {
    ctx.throw(404, 'Post not found');
  }
  const userHeaders = ctx.headers['x-auth-user-data'];
  if (!userHeaders) {
    console.log('post.privacy', post.privacy);
    if (post.privacy === PostPrivacy.PRIVATE) {
      ctx.throw(403, 'Unauthorized to view this post');
    }
  }

  const response = await axios.get(`http://user-service:4002/${post.ownerId}`, {
    withCredentials: true,
  });

  const ownerProfile = response.data;
  if (post.isRepost) {
    const repostOwnerProfileResponse = await axios.get(
      `http://user-service:4002/${post.originalPost.ownerId}`,
      {
        withCredentials: true,
      },
    );
    post.originalPost.ownerProfile = repostOwnerProfileResponse.data;
  }
  if (userHeaders) {
    const { id: ownerId, role } = JSON.parse(userHeaders as string);

    if (post.privacy === PostPrivacy.PRIVATE && post.ownerId !== ownerId && role !== 'admin') {
      ctx.throw(403, 'Unauthorized to view this post');
    }
  }

  return { ...post, ownerProfile };
};

export const deletePost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { id: ownerId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({ where: { id: postId } });

  if (!post) {
    ctx.throw(404, 'Post not found');
  }

  if (post.ownerId !== ownerId && role !== 'admin') {
    ctx.throw(403, 'Unauthorized to delete this post');
  }

  if (post.mediaPath) {
    try {
      deleteFile(post.mediaPath);
    } catch (err) {
      console.error(`Error deleting file for post ${postId}:`, err);
    }
  }

  await postRepository.delete({ id: postId });
};

export const updatePost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const body = ctx.request.body as Partial<Post>;
  const { id: ownerId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  console.log('UPDATE POST BODY', body);

  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({ where: { id: postId } });

  if (!post) {
    ctx.throw(404, 'Post does not exist');
  }

  if (post.ownerId !== ownerId && role !== 'admin') {
    ctx.throw(403, 'Unauthorized to update this post');
  }

  Object.assign(post, body);

  const { files } = ctx.request as any;

  if (files && files.file) {
    console.log('UPDATE POST FILE UPLOADED');
    const media = Array.isArray(files.file) ? files.file[0] : files.file;
    const ext = media.filepath.split('.').pop() as string;
    const path = await uploadFile(media.filepath, post.id, ext);
    post.mediaPath = path;
  }
  return await postRepository.save(post);
};

export const getActivityWall = async (ctx: Context) => {
  const postRepository = AppDataSource.getRepository(Post);

  const userHeaders = ctx.headers['x-auth-user-data'];
  // if (userHeaders || !userHeaders) {
  //   console.log('Unauthorized');
  //   ctx.throw(401, 'Unauthorized');
  // }
  let posts: any;
  if (!userHeaders) {
    posts = await postRepository.find({
      where: { privacy: PostPrivacy.PUBLIC },
      relations: { reposts: true, likes: true, originalPost: true, comments: true },
    });

    console.log('COOL WER ARE HERE 1');
    for (let post of posts) {
      const ownerProfileResponse = await axios.get(`http://user-service:4002/${post.ownerId}`, {
        withCredentials: true,
      });
      post.ownerProfile = ownerProfileResponse.data;
      if (post.isRepost) {
        const repostOwnerProfileResponse = await axios.get(
          `http://user-service:4002/${post.originalPost.ownerId}`,
          {
            withCredentials: true,
          },
        );
        post.originalPost.ownerProfile = repostOwnerProfileResponse.data;
      }
    }
    return posts;
  }
  console.log('userHeaders', userHeaders);
  const { id: userId, role } = JSON.parse(userHeaders as string);
  console.log('COOL WER ARE HERE 2');

  if (role === 'admin') {
    posts = await postRepository.find({
      relations: {
        reposts: true,
        likes: true,
        originalPost: true,
        comments: true,
      },
    });
  } else if (role === 'user') {
    posts = await postRepository.find({
      where: [{ privacy: PostPrivacy.PUBLIC }, { privacy: PostPrivacy.PRIVATE, ownerId: userId }],
      relations: { reposts: true, likes: true, originalPost: true, comments: true },
    });
  }

  for (let post of posts) {
    const ownerProfileResponse = await axios.get(`http://user-service:4002/${post.ownerId}`, {
      withCredentials: true,
    });
    post.ownerProfile = ownerProfileResponse.data;
    if (post.isRepost) {
      const repostOwnerProfileResponse = await axios.get(
        `http://user-service:4002/${post.originalPost?.ownerId}`,
        {
          withCredentials: true,
        },
      );
      post.originalPost.ownerProfile = repostOwnerProfileResponse.data;
    }
  }
  console.log('posts', posts);
  return posts;
};

export const createRepost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { content, privacy } = ctx.request.body as any;
  const { id: ownerId } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const postRepository = AppDataSource.getRepository(Post);

  let originalPost = await postRepository.findOne({
    where: { id: postId },
    relations: { originalPost: true },
  });

  if (!originalPost) {
    ctx.throw(404, 'Original post not found');
  }

  if (originalPost.isRepost && originalPost.originalPost) {
    ctx.throw(400, 'Cannot repost a repost');
  }

  if (originalPost.privacy === PostPrivacy.PRIVATE && originalPost.ownerId !== ownerId) {
    ctx.throw(403, 'Cannot repost a private post');
  }
  let repost: any;

  console.log('Original post on backend', originalPost, 'repost owner id', ownerId);

  repost = postRepository.create({
    ownerId,
    originalPost,
    content,
    privacy,
    isRepost: true,
  });
  const ownerProfileResponse = await axios.get(`http://user-service:4002/${repost.ownerId}`, {
    withCredentials: true,
  });
  repost.ownerProfile = ownerProfileResponse.data;
  const repostOwnerProfileResponse = await axios.get(
    `http://user-service:4002/${repost.originalPost?.ownerId}`,
    {
      withCredentials: true,
    },
  );
  repost.originalPost.ownerProfile = repostOwnerProfileResponse.data;

  await postRepository.save(repost);

  return repost;
};

export const deleteUserActivity = async (ctx: Context) => {
  const { userId } = ctx.params;

  const postRepository = AppDataSource.getRepository(Post);
  const likeRepository = AppDataSource.getRepository(Like);
  const commentsRepository = AppDataSource.getRepository(Comment);

  await postRepository.delete({ ownerId: userId });
  await likeRepository.delete({ userId });
  await commentsRepository.delete({ ownerId: userId });
};
