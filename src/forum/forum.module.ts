import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { UserModule } from 'src/user/user.module';
import { HttpService } from 'src/common/http.service';

@Module({
  imports: [UserModule],
  providers: [ForumService, HttpService],
  controllers: [ForumController],
})
export class ForumModule {}
