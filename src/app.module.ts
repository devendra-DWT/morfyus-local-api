import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from './users/entities/users.entity';
import { DigitaloceanModule } from './digitalocean/digitalocean.module';
import { FileModule } from './file/file.module';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { S3Client } from '@aws-sdk/client-s3';
import { PostmarkModule } from 'nestjs-postmark';
import { NotificationsModule } from './notifications/notifications.module';
import { MailerLiteModule } from './mailer-lite/mailer-lite.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './filters/http-error.filter';
import { Job } from './users/entities/job.entity';

@Module({
  imports: [
    PostmarkModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        serverToken: configService.get('postmark_server_token'),
      }),
    }),
    AppConfigModule,
    AuthModule,
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database_url'),
        entities: [Users, Job],
        synchronize: false,
      }),
    }),
    DigitaloceanModule,
    FileModule,
    AwsSdkModule.registerAsync({
      clientType: S3Client,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        new S3Client({
          endpoint: configService.get<string>('digitalocean_endpoint'),
          forcePathStyle: false,
          region: configService.get<string>('digitalocean_region'),
          credentials: {
            accessKeyId: configService.get<string>(
              'digitalocean_access_key_id',
            ),
            secretAccessKey: configService.get<string>(
              'digitalocean_secret_access_key',
            ),
          },
        }),
      isGlobal: true,
    }),
    NotificationsModule,
    MailerLiteModule,
  ],
  providers: [
    AppResolver,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
