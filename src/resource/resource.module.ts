import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { ThirdPartyModule } from 'src/third-party/thirdParty.module';

@Module({
  imports: [ThirdPartyModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
