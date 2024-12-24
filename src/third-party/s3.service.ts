import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Logger } from '@nestjs/common';
import { slugify } from 'transliteration';
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
      const fileExtension =
        file.originalname.substring(file.originalname.lastIndexOf('.')) || '';

      const sanitizedFileName = slugify(
        file.originalname.slice(0, file.originalname.lastIndexOf('.')),
        { separator: '-', lowercase: true },
      );
      const maxFileNameLength = 50;

      const truncatedFileName = sanitizedFileName.slice(
        0,
        maxFileNameLength - fileExtension.length,
      );

      const key = `${uuid()}-${truncatedFileName}${fileExtension}`;

      // const key = `${uuid()}-${file.originalname}`;
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

  async findFileInCloud(key: string): Promise<boolean> {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      };
      const command = new HeadObjectCommand(params);
      await this.s3.send(command);
      this.logger.log(`File with key ${key} found in S3`);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        this.logger.warn(`File with key ${key} does not exist in S3`);
        return false;
      }
      this.logger.error(`Error when finding file in S3: ${error}`);
      throw new BadRequestException('Error when finding file: ' + error);
    }
  }
}
