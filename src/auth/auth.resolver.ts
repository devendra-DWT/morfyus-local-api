import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Tokens } from './entities/tokens.entity';
import { SignUpInput } from './dto/sign-up.input';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { SignInInput } from './dto/sign-in.input';
import { SignInEntity } from './entities/sign-in.entity';
import { PasswordResetInput } from './dto/password-reset.input';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@Resolver(() => Tokens)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean)
  async confirmEmail(
    @Args({ name: 'email', type: () => String }) email: string,
  ) {
    await this.authService.confirmEmail({ email });

    return true;
  }

  @Mutation(() => Boolean)
  async passwordReset(@Args('passwordResetInput') dto: PasswordResetInput) {
    await this.authService.passwordReset(dto);

    return true;
  }

  @Mutation(() => Tokens)
  singUp(@Args('singUp') dto: SignUpInput) {
    console.log('first');
    return this.authService.singUp(dto);
  }

  @Mutation(() => SignInEntity)
  signIn(@Args('signIn') dto: SignInInput) {
    return this.authService.signIn(dto);
  }

  @Mutation(() => Tokens)
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Context() context) {
    const {
      req: {
        user: { refreshToken },
      },
    } = context;

    return this.authService.refreshTokens(refreshToken);
  }
}
