import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SubscribersInput } from './dto/subscribers.input';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Resolver()
export class MailerLiteResolver {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => Boolean)
  async mailerLiteSubscribers(
    @Args('createMailerLiteInput') dto: SubscribersInput,
  ) {
    const apiKey = this.configService.get<string>('mailer_lite_api_key');
    const groupId = this.configService.get<string>('mailer_lite_group_id');

    await lastValueFrom(
      this.httpService.post(
        `https://connect.mailerlite.com/api/subscribers`,
        JSON.stringify({
          email: dto.email,
          fields: {
            name: dto.name,
          },
          groups: [groupId],
        }),
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      ),
    );

    return true;
  }
}
