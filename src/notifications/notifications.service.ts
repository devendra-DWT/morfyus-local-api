import { Injectable } from '@nestjs/common';
import { InjectPostmark, PostmarkClient } from 'nestjs-postmark';
import { ConfigService } from '@nestjs/config';
import { SendEmailInput } from './dto/send-email.input';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectPostmark() private readonly postmarkClient: PostmarkClient,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail({ to, subject, textBody, htmlBody, cc }: SendEmailInput) {
    await this.postmarkClient.sendEmail({
      From: this.configService.get<string>('postmark_sender_email'),
      To: to,
      Cc: cc,
      Subject: subject,
      TextBody: textBody,
      HtmlBody: htmlBody,
      MessageStream: this.configService.get<string>(
        'postmark_sender_message_stream',
      ),
    });
  }
}
