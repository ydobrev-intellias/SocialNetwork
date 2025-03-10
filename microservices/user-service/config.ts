
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 4001,
    environment: process.env.NODE_ENV || 'development',
}