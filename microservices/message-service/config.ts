import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4005,
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
};
