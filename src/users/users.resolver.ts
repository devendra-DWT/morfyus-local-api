import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { UsersService } from './users.service';
import { UpdateUserByJwtTokenInput } from './dto/update-user-by-jwt-token.input';
import { Users } from './entities/users.entity';
import { GraphQLObjectType } from 'graphql';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => Boolean)
  @UseGuards(AccessTokenGuard)
  async updateUserByJwtToken(
    @Context() context,
    @Args('user') dto: UpdateUserByJwtTokenInput,
  ) {
    const {
      req: { user },
    } = context;

    await this.usersService.updateUserById(user.sub, {
      ...dto,
      username: dto.username.toLowerCase(),
    });
    // await this.usersService.createJob();
    return true;
  }

  @Mutation(() => Boolean)
  async createJobByRssFeed() {
    console.log('called');
    return await this.usersService.createJob();
  }

  @Mutation(() => Boolean)
  async deleteJob() {
    return await this.usersService.deleteJob();
  }
}
