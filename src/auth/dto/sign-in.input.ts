import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class SignInInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Field(() => String)
  password: string;
}
