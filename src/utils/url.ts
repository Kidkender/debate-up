import { BadRequestException } from '@nestjs/common';

export function extractKeyFromUrl(url: string): string {
  const key = url.split('.amazonaws.com/')[1];
  if (!key) {
    throw new BadRequestException('Invalid S3 URL');
  }
  return key;
}
