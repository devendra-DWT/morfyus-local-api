import { Module } from '@nestjs/common';
import { DigitaloceanService } from '../digitalocean/digitalocean.service';
import { FileController } from './file.controller';

@Module({
  providers: [DigitaloceanService],
  controllers: [FileController],
})
export class FileModule {}
