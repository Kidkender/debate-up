import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export class S3Service {
  private logger = new Logger(S3Service.name);

  private s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  async uploadToCloud(file: Express.Multer.File): Promise<string> {
    try {
      const key = `${uuid()}-${file.originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      const location = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return location;
    } catch (error) {
      this.logger.error(`Error when upload file to s3: ${error}`);
      throw new BadRequestException('Upload file failed: ' + error);
    }
  }

  async deleteFromCloud(key: string): Promise<void> {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      };
      const command = new DeleteObjectCommand(params);
      await this.s3.send(command);

      this.logger.log(`Deleted file with key ${key} from S3`);
    } catch (error) {
      this.logger.error(`Error when deleting file from cloud: ${error}`);
    }
  }
}
