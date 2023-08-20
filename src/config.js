import { config } from 'dotenv';

config();

const {
  PORT,
  TOKEN_KEY,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SMTP_SERVICE,
  SMTP_USER,
  SMTP_PASS,
  ROOT_KEY,
} = process.env;

export {
  PORT,
  TOKEN_KEY,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SMTP_SERVICE,
  SMTP_USER,
  SMTP_PASS,
  ROOT_KEY,
};
