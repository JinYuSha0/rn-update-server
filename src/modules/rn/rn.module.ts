import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VersionSchema } from './schemas/VersionSchema';
import { RNController } from './rn.controller';
import { RNService } from './rn.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Version',
        schema: VersionSchema,
      },
    ]),
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [RNController],
  providers: [RNService],
})
export class RNModule {}
