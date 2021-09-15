const path = require('path');
const compressing = require('compressing');
const fs = require('fs');
import {
  Controller,
  Get,
  Query,
  Inject,
  CACHE_MANAGER,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RNService } from './rn.service';
import { ValidationPipe } from '@pipes/validationPipe';
import { createDirIfNotExists } from '@utils/fsUtils';
import UpdateComponentDTO from './dto/updateComponent.dto';

@Controller('rn')
export class RNController {
  constructor(private readonly RNService: RNService) {}

  @Get('checkUpdate')
  login(): any {
    return {};
  }

  @Post('updateComponent')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) body: UpdateComponentDTO,
  ): Promise<void> {
    const pwd = process.env.PWD;
    const compressingDestPath = createDirIfNotExists(
      path.join(pwd, 'temp', file.originalname.split('.')[0]),
    );
    try {
      await compressing.zip.uncompress(
        path.join(pwd, file.path),
        compressingDestPath,
      );
      const childPath = fs.readdirSync(compressingDestPath)[0];
      const settingJSONPath = path.join(
        compressingDestPath,
        childPath,
        'setting.json',
      );
      if (!fs.existsSync(settingJSONPath)) {
        throw new Error('Not setting.json');
      }
      const setting = JSON.parse(fs.readFileSync(settingJSONPath));
      this.RNService.insertOneComponent({
        vsersion: +body.version,
        hash: setting.hash,
        commonHash: setting.commonHash,
        componentName: setting.componentName,
        isCommon: false,
        downloadUrl: '',
        buildTime: setting.timestamp,
      });
    } finally {
      const uploadFilePath = path.join(pwd, 'upload', file.filename);
      if (fs.existsSync(uploadFilePath)) {
        fs.unlinkSync(uploadFilePath);
      }

      // if (fs.existsSync(compressingDestPath)) {
      //   fs.unlinkSync(compressingDestPath);
      // }
    }
  }
}
