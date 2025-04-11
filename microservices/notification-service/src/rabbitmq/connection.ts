import amqp, { Channel, ChannelModel } from 'amqplib';
import { config } from '../../config';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export const connectToRabbitMQ = async (): Promise<{ connection: ChannelModel; channel: Channel } | void> => {
  try {
    if (!connection || !channel) {
      connection = await amqp.connect(config.rabbitmqUrl);
      channel = await connection.createChannel();
    }
    return { connection, channel };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
};

export const getConnection = (): ChannelModel | null => {
  return connection;
};

export const getChannel = (): Channel | null => {
  return channel;
};
