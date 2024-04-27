import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { DigitaloceanService } from '../digitalocean/digitalocean.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly digitaloceanService: DigitaloceanService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const type = file.originalname.split('.').pop();

    const url = await this.digitaloceanService.uploadObject({
      fileType: type,
      buffer: file.buffer,
    });

    return { url };
  }
}
