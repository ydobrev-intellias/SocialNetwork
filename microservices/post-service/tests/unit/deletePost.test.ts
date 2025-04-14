import { Context } from 'koa';
import { deletePost } from '../../src/services/post.service';
import { PostPrivacy } from '../../src/types/common';
import { Post } from '../../src/entities/Post';
import axios from 'axios';

const mockFindOne = jest.fn();

jest.mock('../../src/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({ findOne: mockFindOne, delete: jest.fn() })),
  },
}));
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('deletePost', () => {
  let ctx: Partial<Context>;

  beforeEach(() => {
    jest.clearAllMocks();
    ctx = {
      params: {
        postId: '1',
      },
      headers: {
        'x-auth-user-data': '{"id": "1"}',
      },
      throw: ((status, message) => {
        throw Object.assign(new Error(message as string), { status });
      }) as Context['throw'],
    };
  });
  it('should delete a post successfully', async () => {
    mockFindOne.mockResolvedValueOnce({ id: '1', ownerId: '1' } as Post);
    mockedAxios.get.mockResolvedValueOnce({ data: { username: 'User' } });
    await expect(deletePost(ctx as Context)).resolves;
  });
  it('should throw 404 if post does not exist', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    await expect(() => deletePost(ctx as Context)).rejects.toMatchObject({
      status: 404,
      message: 'Post not found',
    });
  });
  it('should throw 403 if not authorized', async () => {
    mockFindOne.mockResolvedValueOnce({ privacy: PostPrivacy.PRIVATE });
    await expect(() => deletePost(ctx as Context)).rejects.toMatchObject({
      status: 403,
      message: 'Unauthorized to delete this post',
    });
  });
});
