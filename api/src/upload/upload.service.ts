import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    this.bucket = this.configService.get<string>('R2_BUCKET_NAME') ?? 'heyama-objects';
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL') ?? '';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID') ?? '',
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY') ?? '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ key: string; url: string }> {
    const ext = file.originalname.split('.').pop();
    const key = `objects/${uuidv4()}.${ext}`;

    this.logger.log(`Uploading file to R2: ${key}`);

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `${this.publicUrl}/${key}`;
    return { key, url };
  }

  async deleteFile(key: string): Promise<void> {
    this.logger.log(`Deleting file from R2: ${key}`);

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
