import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RNModule } from './modules/rn/rn.module';
import appConfig from '@configs/app';
import mongodbConfig from '@configs/mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: false,
      isGlobal: true,
      load: [mongodbConfig, appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        APP_PORT: Joi.number().default(3000),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
        user: configService.get<string>('mongodb.user'),
        pass: configService.get<string>('mongodb.pass'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    RNModule,
  ],
})
export class AppModule {}
