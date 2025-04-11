import { getChannel } from './connection';

export const setupConsumer = async (queue: string, messageHandler: (payload: any) => void) => {
  const channel = getChannel();
  if (!channel) {
    throw new Error('RabbitMQ channel not available');
  }

  await channel.assertQueue(queue, { durable: true });

  channel.consume(
    queue,
    async (msg) => {
      if (!msg) return;

      try {
        const payload = JSON.parse(msg.content.toString());

        await messageHandler(payload);

        channel.ack(msg);
      } catch (error) {
        console.error('Failed to process message:', error);
        channel.nack(msg);
      }
    },
    { noAck: false },
  );
};
