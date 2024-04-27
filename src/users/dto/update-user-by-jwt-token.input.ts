import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsIn, IsOptional, Length, Matches } from 'class-validator';

@InputType()
export class UpdateUserByJwtTokenInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Username can only contain letters, numbers, underscores, and dashes.',
  })
  username?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  @IsIn([true], { each: true })
  isCompleted?: boolean;
}
