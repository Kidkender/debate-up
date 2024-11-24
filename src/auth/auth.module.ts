import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mails/mail.module';

@Module({
  imports: [UserModule, MailModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
