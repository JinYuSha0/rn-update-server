import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Version, InsertComponent } from './types';
import { zip } from 'compressing';
import { join } from 'path';
import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  rmdirSync,
} from 'fs';
import { createDirIfNotExists } from '@utils/fsUtils';
import { ConfigService } from '@nestjs/config';
import UpdateComponentDTO from './dto/updateComponent.dto';

@Injectable()
export class RNService {
  constructor(
    @InjectModel('Version') private readonly versionModel: Model<Version>,
    private readonly configService: ConfigService,
  ) {}

  async updateComponent(file: Express.Multer.File, body: UpdateComponentDTO) {
    const pwd = process.env.PWD;
    const compressingDestPath = createDirIfNotExists(
      join(pwd, 'temp', file.originalname.split('.')[0]),
    );
    try {
      await zip.uncompress(join(pwd, file.path), compressingDestPath);
      const childPath = readdirSync(compressingDestPath)[0];
      const settingJSONPath = join(
        compressingDestPath,
        childPath,
        'setting.json',
      );
      if (!existsSync(settingJSONPath)) {
        throw new Error('Not setting.json');
      }
      const setting = JSON.parse(readFileSync(settingJSONPath).toString());
      await new this.versionModel({
        version: +body.version,
        hash: setting.hash,
        commonHash: setting.commonHash,
        componentName: setting.componentName,
        isCommon: false,
        downloadUrl: this.configService.get('app.host') + file.filename,
        buildTime: setting.timestamp,
      }).save();
      return {
        downloadUrl: this.configService.get('app.host') + file.filename
      }
    } catch (err) {
      const uploadFilePath = join(pwd, 'upload', file.filename);
      if (existsSync(uploadFilePath)) {
        unlinkSync(uploadFilePath);
      }
      throw err;
    } finally {
      if (existsSync(compressingDestPath)) {
        rmdirSync(compressingDestPath, { recursive: true });
      }
    }
  }

  findAllNewestComponentByCommonHash() {
    return {};
  }
}
