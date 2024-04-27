import { Query, Resolver } from '@nestjs/graphql';

@Resolver(() => String)
export class AppResolver {
  constructor() {}

  @Query(() => String)
  test(): string {
    return 'successfully';
  }
}
