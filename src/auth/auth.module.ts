import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [JwtModule.register({}), UsersModule, NotificationsModule],
  providers: [
    AuthResolver,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ConfigModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
