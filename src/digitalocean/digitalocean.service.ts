import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { InjectAws } from 'aws-sdk-v3-nest';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DigitaloceanService {
  constructor(
    @InjectAws(S3Client) private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadObject({ fileType, buffer }) {
    const fileName = `${nanoid()}.${fileType}`;
    const bucket = this.configService.get<string>('digitalocean_bucket');
    const region = this.configService.get<string>('digitalocean_region');

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: buffer,
        ACL: 'public-read',
        ContentEncoding: 'base64',
      }),
    );

    return `https://${bucket}.${region}.cdn.digitaloceanspaces.com/${fileName}`;
  }
}
