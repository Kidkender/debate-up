import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { ThirdPartyModule } from 'src/third-party/thirdParty.module';

@Module({
  imports: [UserModule, ThirdPartyModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
