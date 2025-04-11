import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4006,
  environment: process.env.NODE_ENV || 'development',
  rabbitmqUrl: process.env.RABBITMQ_URL || '',
};
