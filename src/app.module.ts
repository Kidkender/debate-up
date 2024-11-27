import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { ConfigType } from './config/config';
import { ResourceModule } from './resource/resource.module';
import { ThirdPartyModule } from './third-party/thirdParty.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<ConfigType>) => ({
        secret: config.get('jwt').secret,
      }),
      global: true,
      inject: [ConfigService],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ThirdPartyModule,
    ResourceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
