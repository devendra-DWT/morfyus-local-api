import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';

import { SendEmailInput } from './dto/send-email.input';

@Resolver()
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Mutation(() => Boolean)
  async sendEmail(@Args('sendEmail') dto: SendEmailInput) {
    await this.notificationsService.sendEmail({
      to: dto.to,
      cc: dto.cc,
      subject: dto.subject,
      textBody: dto.textBody,
      htmlBody: dto.htmlBody,
    });

    return true;
  }
}
