import { Module } from '@nestjs/common';
import { MailerLiteResolver } from './mailer-lite.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [MailerLiteResolver, ConfigModule],
})
export class MailerLiteModule {}
