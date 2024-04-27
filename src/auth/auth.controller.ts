import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('verifyEmail')
  async verifyEmail(@Query('key') key: string, @Res() res): Promise<void> { 
    const user = await this.authService.verifyUserEmail({
      confirmEmailToken: key,
    });

    const tokens = await this.authService.generateTokens({
      userId: user.id,
      role: user.role,
    });
    

    res.redirect(
      `${this.configService.get<string>(
        'frontend_url',
      )}/account/sign-in?access_token=${tokens.accessToken}&refresh_token=${
        tokens.refreshToken
      }&role=${user.role}&is_completed=${user.isCompleted}`,
    );
  }
}
