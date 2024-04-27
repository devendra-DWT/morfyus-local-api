import { ObjectType, Field } from '@nestjs/graphql';
import { Tokens } from './tokens.entity';

@ObjectType()
export class SignInEntity extends Tokens {
  @Field(() => String)
  role: string;

  @Field(() => Boolean)
  isCompleted: boolean;

  @Field(() => String, { nullable: true })
  cid: string | null;
}
