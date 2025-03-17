import { config } from '../../config';
import { AppDataSource } from '../data-source';
import { AuthUser } from '../entities/AuthUser';
import { connectToRabbitMQ } from './connection';

export const consumeMessages = async () => {
  const result = await connectToRabbitMQ();

  if (!result) {
    throw new Error('RabbitMQ could not be connected');
  }

  const { channel } = result;
  if (!channel) {
    throw new Error('RabbitMQ channel not available');
  }

  await channel.assertQueue(config.rabbitmqQueueName, { durable: true });

  channel.consume(
    config.rabbitmqQueueName,
    async (msg) => {
      if (msg) {
        const { type, data } = JSON.parse(msg.content.toString());
        console.log(`[x] Received: ${data}`);
        if (type === 'USER_CREATED') {
          const authRepository = AppDataSource.getRepository(AuthUser);

          const createdAuthUser = await authRepository.create({
            id: data.id,
            username: data.username,
            password: data.password,
            role: data.role,
          });

          await authRepository.save(createdAuthUser);

          channel.ack(msg);
        }
      }
    },
    { noAck: false },
  );
};
