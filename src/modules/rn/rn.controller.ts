import UpdateComponentDTO from './dto/updateComponent.dto';
import CheckUpdateDTO from './dto/checkUpdate.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RNService } from './rn.service';
import { Component } from './types';

@Controller('rn')
export class RNController {
  constructor(private readonly RNService: RNService) {}

  @Get('checkUpdate')
  async checkUpdate(@Query() query: CheckUpdateDTO): Promise<Component[]> {
    return await this.RNService.checkUpdate(query);
  }

  @Post('updateComponent')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateComponentDTO,
  ): Promise<{ downloadUrl: string }> {
    return await this.RNService.updateComponent(file, body);
  }
}
