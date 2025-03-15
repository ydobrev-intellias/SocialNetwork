import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4001,
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  rabbitmqUrl: process.env.RABBITMQ_URL || '',
  rabbitmqQueueName: process.env.RABBITMQ_USER_EVENTS_QUEUE || '',
  saltRounds: 10,
  jwtSecret: process.env.SECRET_KEY || '',
  jwtExpiration: 3600,
};
