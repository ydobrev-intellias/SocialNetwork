import dotenv from 'dotenv';
dotenv.config();

const maxAgeMs = 86400000;

export const config = {
  port: process.env.PORT || 4001,
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  saltRounds: 10,
  jwtSecret: process.env.SECRET_KEY || '',
  cookieMaxAge: maxAgeMs,
  jwtExpiration: maxAgeMs / 1000,
  userServiceUrl: process.env.USER_SERVICE_URL || '',
};
