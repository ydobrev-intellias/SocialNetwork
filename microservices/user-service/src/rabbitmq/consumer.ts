import { connectToRabbitMQ } from './connection';
import { config } from '../../config';
import { AppDataSource } from '../data-source';

import { publishMessage } from './publisher';
import { User } from '../entities/User';
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

  console.log(`[*] Waiting for messages in queue: ${config.rabbitmqQueueName}`);

  channel.consume(
    config.rabbitmqQueueName,
    async (msg) => {
      if (msg) {
        const { type, data } = JSON.parse(msg.content.toString());
        console.log(`[x] Received: ${data}`);
        if (type === 'USER_SIGNUP') {
          const userRepository = AppDataSource.getRepository(User);

          const createdUser = userRepository.create({
            id: data.id,
            username: data.username,
            password: data.password,
            role: data.role,
          });

          await userRepository.save(createdUser);

          await publishMessage(
            config.rabbitmqQueueName,
            JSON.stringify({ type: 'USER_CREATED', data: createdUser }),
          );
        }
        channel.ack(msg);
      }
    },
    { noAck: false },
  );
};
