import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Component } from './types';
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
import { isEmpty } from 'lodash';
import UpdateComponentDTO from './dto/updateComponent.dto';
import CheckUpdateDTO from './dto/checkUpdate.dto';

@Injectable()
export class RNService {
  constructor(
    @InjectModel('Version') private readonly componentModel: Model<Component>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 上传业务包更新组件版本
   * @param file
   * @param body
   * @returns
   */
  async updateComponent(file: Express.Multer.File, body: UpdateComponentDTO) {
    const cwd = process.cwd();
    const compressingDestPath = createDirIfNotExists(
      join(cwd, 'temp', file.originalname.split('.')[0]),
    );
    try {
      await zip.uncompress(join(cwd, file.path), compressingDestPath);
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
      await new this.componentModel({
        platform: setting.platform,
        version: +body.version,
        hash: setting.hash,
        commonHash: setting.commonHash,
        componentName: setting.componentName,
        componentType: setting.componentType,
        downloadUrl: file.filename,
        buildTime: setting.timestamp,
      }).save();
      return {
        downloadUrl: this.configService.get('app.host') + file.filename,
      };
    } catch (err) {
      const uploadFilePath = join(cwd, 'upload', file.filename);
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

  /**
   * 查询最新的版本
   * @param query
   * @returns
   */
  async checkUpdate(query: CheckUpdateDTO): Promise<Component[]> {
    const { platform, commonHash } = query;
    const res = await this.componentModel.aggregate([
      {
        $match: {
          platform,
          ...(!isEmpty(commonHash) ? { commonHash } : {}),
        },
      },
      { $sort: { version: -1 } },
      {
        $group: {
          _id: '$componentName',
          version: { $first: '$version' },
          hash: { $first: '$hash' },
          commonHash: { $first: '$commonHash' },
          componentName: { $first: '$componentName' },
          componentType: { $first: '$componentType' },
          downloadUrl: { $first: '$downloadUrl' },
          buildTime: { $first: '$buildTime' },
        },
      },
      { $project: { _id: 0 } },
    ]);
    const host = this.configService.get('app.host');
    return res.map((item) => {
      item.downloadUrl = host + item.downloadUrl;
      return item;
    });
  }
}
