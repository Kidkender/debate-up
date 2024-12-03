import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { S3Service } from './s3.service';

@Module({
  providers: [EmailService, S3Service],
  exports: [EmailService, S3Service],
})
export class ThirdPartyModule {}
