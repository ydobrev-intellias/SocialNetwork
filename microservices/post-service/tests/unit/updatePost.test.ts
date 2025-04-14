import { Context } from 'koa';
import { updatePost } from '../../src/services/post.service';
import { AppDataSource } from '../../src/data-source';

jest.mock('../../src/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('../../src/utils/uploadFile', () => ({
  uploadFile: jest.fn(),
}));

const mockFindOne = jest.fn();
const mockSave = jest.fn();

(AppDataSource.getRepository as jest.Mock).mockReturnValue({
  findOne: mockFindOne,
  save: mockSave,
});

describe('updatePost', () => {
  let ctx: Partial<Context>;

  beforeEach(() => {
    jest.clearAllMocks();

    ctx = {
      params: { postId: '123' },
      request: {
        body: { content: 'Updated content' },
      } as any,
      headers: {
        'x-auth-user-data': JSON.stringify({ id: '1', role: 'user' }),
      },
      throw: ((status: number, message?: string) => {
        throw Object.assign(new Error(message as string), { status });
      }) as Context['throw'],
    };
  });

  it('should update the post successfully without media', async () => {
    const mockPost = { id: '123', ownerId: '1', content: 'Old content' };

    mockFindOne.mockResolvedValue(mockPost);
    mockSave.mockResolvedValue({ ...mockPost, content: 'Updated content' });

    const result = await updatePost(ctx as Context);

    expect(result.content).toBe('Updated content');
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({ content: 'Updated content' }));
  });

  it('should throw 404 if post not found', async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(updatePost(ctx as Context)).rejects.toMatchObject({
      status: 404,
      message: 'Post does not exist',
    });
  });

  it('should throw 403 if user is not owner or admin', async () => {
    const mockPost = { id: '123', ownerId: '2', content: 'Post' }; // user is ownerId: 1

    mockFindOne.mockResolvedValue(mockPost);

    await expect(updatePost(ctx as Context)).rejects.toMatchObject({
      status: 403,
      message: 'Unauthorized to update this post',
    });
  });

  it("should allow admins to update other users' posts", async () => {
    ctx.headers!['x-auth-user-data'] = JSON.stringify({ id: '999', role: 'admin' });

    const mockPost = { id: '123', ownerId: '2', content: 'Old content' };

    mockFindOne.mockResolvedValue(mockPost);
    mockSave.mockResolvedValue({ ...mockPost, content: 'Updated content' });

    const result = await updatePost(ctx as Context);

    expect(result.content).toBe('Updated content');
    expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({ content: 'Updated content' }));
  });
});
