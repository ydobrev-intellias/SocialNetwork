import { Context } from 'koa';
import axios from 'axios';
import { getPost } from '../../src/services/post.service';
import { AppDataSource } from '../../src/data-source';
import { Repository, FindOneOptions } from 'typeorm';
import { PostPrivacy } from '../../src/types/common';

jest.mock('axios');
const mockFindOne = jest.fn();
jest.mock('../../src/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({ findOne: mockFindOne })),
  },
}));

describe('getPost', () => {
  let ctx: Partial<Context>;

  beforeEach(() => {
    jest.clearAllMocks();

    ctx = {
      params: { postId: '123' },
      headers: { 'x-auth-user-data': '{"id": "1", "role": "user"}' },
      throw: ((status, message) => {
        throw Object.assign(new Error(message as string), { status });
      }) as Context['throw'],
    };
  });

  it('should return the post with its owner profile', async () => {
    const mockPost = { id: '123', ownerId: '1', privacy: PostPrivacy.PUBLIC };
    const mockOwnerProfile = { username: 'owner' };

    (axios.get as jest.Mock).mockResolvedValue({ data: mockOwnerProfile });
    mockFindOne.mockResolvedValueOnce(mockPost);
    const result = await getPost(ctx as Context);

    expect(result).toEqual({
      ...mockPost,
      ownerProfile: mockOwnerProfile,
    });
  });

  it('should throw 404 if post not found', async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(() => getPost(ctx as Context)).rejects.toMatchObject({
      status: 404,
      message: 'Post not found',
    });
  });

  it('should throw 403 if trying to access a private post without authorization', async () => {
    const mockPost = { id: '123', ownerId: '2', privacy: PostPrivacy.PRIVATE };

    mockFindOne.mockResolvedValue(mockPost);
    ctx.headers = {};
    await expect(getPost(ctx as Context)).rejects.toMatchObject({
      status: 403,
      message: 'Unauthorized to view this post',
    });
  });
});
