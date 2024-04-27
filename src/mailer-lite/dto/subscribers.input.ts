import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class SubscribersInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Field(() => String)
  name: string;
}
