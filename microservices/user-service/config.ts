import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4002,
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  rabbitmqUrl: process.env.RABBITMQ_URL || '',
  rabbitmqQueueName: process.env.RABBITMQ_USER_EVENTS_QUEUE || '',
  authServiceUrl: process.env.AUTH_SERVICE_URL || '',
  postServiceUrl: process.env.POST_SERVICE_URL || '',
};
