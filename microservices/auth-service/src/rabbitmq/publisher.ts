import { connectToRabbitMQ, getChannel } from './connection';
export const publishMessage = async (queue: string, message: string): Promise<void> => {
  try {
    await connectToRabbitMQ();
    const channel = getChannel();

    if (!channel) {
      console.error('No channel available for publishing!');
      return;
    }

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent message to queue ${queue}: ${message}`);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
};
