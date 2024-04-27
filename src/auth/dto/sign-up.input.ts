import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { RolesEnum } from '../../users/enum/roles.enum';

@InputType()
export class SignUpInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @IsEnum(RolesEnum)
  @Field(() => String)
  role: string;
}
