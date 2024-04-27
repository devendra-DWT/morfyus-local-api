import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendEmailInput {
  @Field(() => String)
  to: string;

  @Field(() => String, { nullable: true })
  cc?: string;

  @Field(() => String)
  subject: string;

  @Field(() => String, { nullable: true })
  textBody?: string;

  @Field(() => String, { nullable: true })
  htmlBody?: string;
}
