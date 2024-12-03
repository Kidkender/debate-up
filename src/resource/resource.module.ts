import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { ThirdPartyModule } from 'src/third-party/thirdParty.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [ThirdPartyModule, CategoryModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
