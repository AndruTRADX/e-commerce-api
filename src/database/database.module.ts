import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import config from 'src/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          uri: configService.mongo.url,
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'MONGO',
      useFactory: async (configService: ConfigType<typeof config>) => {
        const URI = configService.mongo.url;

        try {
          await mongoose.connect(URI);
          console.log('Connected to MongoDB Atlas');
        } catch (error) {
          console.error('Failed to connect to MongoDB Atlas:', error);
        }

        return mongoose.connection.db;
      },
      inject: [config.KEY],
    },
  ],
})
export class DatabaseModule {}
