import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class PasswordResetInput {
  @IsNotEmpty()
  @Field(() => String)
  newPassword: string;

  @IsNotEmpty()
  @Field(() => String)
  resetPasswordToken: string;
}
