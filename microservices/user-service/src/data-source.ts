import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.databaseUrl,
  synchronize: true,
  logging: true,
  entities: ['src/entities/*.ts'],
  migrations: [],
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Connected to PostgreSQL database!');
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
};
