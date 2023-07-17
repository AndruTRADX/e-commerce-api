import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    mongo: {
      url: process.env.MONGODB_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
});