import { config } from 'dotenv';

config();

const { PORT, TOKEN_KEY, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } =
  process.env;

export { PORT, TOKEN_KEY, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE };
