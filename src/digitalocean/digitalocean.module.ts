import { Module } from '@nestjs/common';
import { DigitaloceanService } from './digitalocean.service';

@Module({
  providers: [DigitaloceanService],
  exports: [DigitaloceanService],
})
export class DigitaloceanModule {}
