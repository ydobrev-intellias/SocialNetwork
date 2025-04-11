import { getChannel } from './connection';

export const produceMessages = async (
  queue: string,
  data: {
    content: string;
    ownerId: string;
    createdAt: Date;
    targetId: string;
  },
) => {
  const channel = getChannel();

  if (!channel) return;

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};
