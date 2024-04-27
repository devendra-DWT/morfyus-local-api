import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { render } from '@react-email/render';
import { SignUpInput } from './dto/sign-up.input';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignInInput } from './dto/sign-in.input';
import { SignInEntity } from './entities/sign-in.entity';
import { RolesEnum } from '../users/enum/roles.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { Users } from '../users/entities/users.entity';
import { randomBytes } from 'crypto';
import { PasswordResetInput } from './dto/password-reset.input';
import { ConfirmEmail } from '../emails/confirm-email';
import { ResetPassword } from '../emails/reset-password';
import axios from 'axios';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async singUp(props: SignUpInput) {
    const isUserExists: any = await this.usersService.getUserByEmail(
      props.email,
    );

    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(props.password);
    const newUser: any = await this.usersService.createNewUser({
      ...props,
      password: hash,
      isCompleted: props.role !== RolesEnum.customer,
    });

    const confirmationLink = `${this.configService.get<string>(
      'api_url',
    )}/auth/verifyEmail?key=${newUser.confirmEmailToken}`;

    const emailHtml = render(ConfirmEmail({ confirmLink: confirmationLink }));

    await this.notificationsService.sendEmail({
      to: newUser.email,
      subject: 'Confirm email',
      htmlBody: emailHtml,
    });

    const tokens = await this.generateTokens({
      userId: newUser.id,
      role: newUser.role,
    });
    await this.usersService.updateUserRefreshTokenById(newUser.id, {
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async signIn(props: SignInInput): Promise<SignInEntity> {
    const user: any = await this.usersService.getUserByEmail(props.email);
    if (!user) {
      throw new BadRequestException('Password or email is incorrect');
    }

    const isPasswordMatches = await bcrypt.compare(
      props.password,
      user.password,
    );
    if (!isPasswordMatches) {
      throw new BadRequestException('Password or email is incorrect');
    }

    // if (!user.isEmailConfirmed) {
    //   throw new BadRequestException('Email not confirmed');
    // }

    const tokens = await this.generateTokens({
      userId: user.id,
      role: user.role,
    });
    await this.usersService.updateUserRefreshTokenById(user.id, {
      refreshToken: tokens.refreshToken,
    });

    return {
      ...tokens,
      role: user.role,
      isCompleted: user.isCompleted,
      cid: user.cid,
    };
  }

  async confirmEmail({ email }: { email: string }) {
    const user: Users = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const resetPasswordToken = randomBytes(32).toString('hex');
    await this.usersService.updateUser(
      { email },
      { resetPasswordToken: resetPasswordToken },
    );
    const resetPasswordLink = `${this.configService.get<string>(
      'frontend_url',
    )}/account/password-reset/${resetPasswordToken}`;

    const emailHtml = render(ResetPassword({ resetLink: resetPasswordLink }));

    await this.notificationsService.sendEmail({
      to: email,
      subject: 'Password reset',
      htmlBody: emailHtml,
    });
  }

  async passwordReset({ resetPasswordToken, newPassword }: PasswordResetInput) {
    const user: Users = await this.usersService.getUser({ resetPasswordToken });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const hash = await this.hashData(newPassword);
    await this.usersService.updateUserById(user.id, {
      resetPasswordToken: null,
      password: hash,
    });
  }

  async refreshTokens(refreshToken: string) {
    const { sub } = this.jwtService.decode(refreshToken);

    const user: any = await this.usersService.getUserById(sub);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    if (refreshToken !== user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens({
      userId: user.id,
      role: user.role,
    });
    await this.usersService.updateUserRefreshTokenById(user.id, {
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async verifyUserEmail({
    confirmEmailToken,
  }: {
    confirmEmailToken: string;
  }): Promise<Users> {
    const user: Users = await this.usersService.getUser({
      confirmEmailToken,
    });

    if (!user) {
      throw new ForbiddenException(
        'We apologize for the inconvenience. The link you have clicked from our email appears to be either expired or invalid. Please try again or contact our customer support for further assistance',
      );
    }
    await this.usersService.updateUserById(user.id, {
      isEmailConfirmed: true,
      confirmEmailToken: null,
    });
    await this.verifyGalxe(user.email);
    return user;
  }

  private hashData(data: string) {
    return bcrypt.hash(data, +this.configService.get<string>('salt_rounds'));
  }

  async generateTokens({ userId, role }: { userId: number; role: string }) {
    const accessToken = await this.jwtService.signAsync(
      {
        iss: 'access',
        sub: userId.toString(),
        'https://hasura.io/jwt/claims': {
          'x-hasura-default-role': role,
          'x-hasura-allowed-roles': [role],
          'x-hasura-user-id': userId.toString(),
        },
      },
      {
        secret: this.configService.get<string>('jwt_access_secret'),
        expiresIn: this.configService.get<string>('jwt_access_expires_in'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        iss: 'refresh',
        sub: userId.toString(),
        'https://hasura.io/jwt/claims': {
          'x-hasura-default-role': 'admin',
          'x-hasura-allowed-roles': ['admin'],
          'x-hasura-user-id': userId.toString(),
        },
      },
      {
        secret: this.configService.get<string>('jwt_refresh_secret'),
        expiresIn: this.configService.get<string>('jwt_refresh_expires_in'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyGalxe(email: string) {
    const credId = '321894916276527104';
    const operation = 'APPEND';
    const items = [email];

    let data = JSON.stringify({
      query: `mutation credentialItems($credId: ID!, $operation: Operation!, $items: [String!]!) 
      { 
        credentialItems(input: { 
          credId: $credId 
          operation: $operation 
          items: $items 
        }) 
        { 
          name 
        } 
      }`,
      variables: {
        credId: '321894916276527104',
        operation: 'APPEND',
        items: items,
      },
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://graphigo.prd.galaxy.eco/query',
      headers: {
        'access-token': '8HROGm5D3xyB3W009vYV3jaaXPqOldy2',
        'Content-Type': 'application/json',
        Cookie:
          'AWSALB=tBCmrHuJzt+IqtbxSMOqMIRQbUTfuR+1QDTKPM5DoYjRhDyzC6+CcHypSUbiLhxXjkoXy1iEslrWWvxX1Dqku5Pi+AcSMF5Qkhc8IVbWr5HSfz8oin/hCnwSF5qy; AWSALBCORS=tBCmrHuJzt+IqtbxSMOqMIRQbUTfuR+1QDTKPM5DoYjRhDyzC6+CcHypSUbiLhxXjkoXy1iEslrWWvxX1Dqku5Pi+AcSMF5Qkhc8IVbWr5HSfz8oin/hCnwSF5qy',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
