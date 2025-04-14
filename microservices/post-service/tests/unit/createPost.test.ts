import { createPost } from '../../src/services/post.service';
import { Context } from 'koa';
import { AppDataSource } from '../../src/data-source';
import { uploadFile } from '../../src/utils/uploadFile';
import axios from 'axios';
import { produceMessages } from '../../src/rabbitmq/producer';

jest.mock('../../src/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      create: jest.fn().mockImplementation((data) => ({ ...data })),
      save: jest.fn().mockImplementation((post) => Promise.resolve({ ...post })),
    }),
  },
}));

jest.mock('../../src/utils/uploadFile', () => ({
  uploadFile: jest.fn().mockResolvedValue('path/to/media.jpg'),
}));

jest.mock('axios');
jest.mock('../../src/rabbitmq/producer', () => ({
  produceMessages: jest.fn(),
}));

describe('createPost', () => {
  it('should create a post and upload a file if provided', async () => {
    const mockCtx = {
      request: {
        body: { content: 'Hello world!' },
        files: {
          file: {
            filepath: 'uploads/file1.jpg',
          },
        },
      },
      headers: {
        'x-auth-user-data': JSON.stringify({ id: 'user123', username: 'yavor' }),
      },
    } as unknown as Context;

    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        username: 'yavor',
        followers: [],
      },
    });

    const post = await createPost(mockCtx);

    expect(post).toHaveProperty('ownerId', 'user123');
    expect(uploadFile).toHaveBeenCalledWith('uploads/file1.jpg', post.id, 'jpg');
    expect(produceMessages).toHaveBeenCalledWith(
      'followersNotifications',
      expect.objectContaining({
        content: 'yavor created a new post',
      }),
    );
  });
});
