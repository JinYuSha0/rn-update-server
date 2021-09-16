import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT || 3000,
  name: process.env.APP_NAME,
  host: process.env.APP_HOST,
}));
