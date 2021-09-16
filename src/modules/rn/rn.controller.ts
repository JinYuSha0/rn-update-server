import UpdateComponentDTO from './dto/updateComponent.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RNService } from './rn.service';
import { ValidationPipe } from '@pipes/validationPipe';

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
  ): Promise<{ downloadUrl: string }> {
    return await this.RNService.updateComponent(file, body);
  }
}
