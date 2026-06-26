import { config } from 'dotenv';

// Populate process.env from .env file
config();

export const appConfig = {
  port: +(process.env.PORT || 8080),
  databaseId: process.env.DATABASE_ID || 'development',
  firebaseApiKey: process.env.FIREBASE_API_KEY ?? '',
  firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN ?? '',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? '',
  cloudTasksQueue: process.env.CLOUD_TASKS_QUEUE ?? 'shamvelo-refresh',
  cloudTasksLocation: process.env.CLOUD_TASKS_LOCATION ?? 'us-central1',
  cloudTasksServiceUrl: process.env.CLOUD_TASKS_SERVICE_URL ?? '',
  tasksAuthToken: process.env.TASKS_AUTH_TOKEN ?? '',
};
