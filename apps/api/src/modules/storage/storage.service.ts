import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { UploadFilePayloadSchema } from '@hobbies-collection/shared';
import type z from 'zod';
import type { Deps } from '~/shared/types/deps.js';

export class StorageService {
  private s3Client: S3Client | null = null;
  private readonly region: string;
  private readonly bucket: string;
  private readonly customEndpoint: string | undefined;

  constructor(private readonly deps: Deps<'configService'>) {
    this.region = deps.configService.getKey('AWS_REGION');
    this.customEndpoint = deps.configService.getKey('S3_ENDPOINT');
    this.bucket = deps.configService.getKey('S3_ASSETS_BUCKET');
  }

  initClient() {
    const s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.deps.configService.getKey('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.deps.configService.getKey('AWS_SECRET_ACCESS_KEY'),
      },
      endpoint: this.customEndpoint ? this.customEndpoint : undefined,
      forcePathStyle: !!this.customEndpoint,
    });
    return s3Client;
  }

  private getOrInitClient() {
    if (!this.s3Client) {
      this.s3Client = this.initClient();
    }

    return this.s3Client;
  }

  async getUploadUrl(payload: z.infer<typeof UploadFilePayloadSchema>) {
    const s3Client = this.getOrInitClient();

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: payload.key,
      ContentType: payload.fileType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return url;
  }

  getBaseStorageUrl() {
    if (this.customEndpoint) {
      return `${this.customEndpoint}/${this.bucket}/`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/`;
  }
}
