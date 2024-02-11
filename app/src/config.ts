import { config } from 'dotenv';

// Populate process.env from .env file
config();

export const appConfig = {
  port: +(process.env.PORT || 8080),
};
