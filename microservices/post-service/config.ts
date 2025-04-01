import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4003,
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  userServiceUrl: process.env.USER_SERVICE_URL || '',
};
