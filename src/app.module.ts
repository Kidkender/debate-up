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
import { CategoryModule } from './category/category.module';
import { CourseModule } from './course/course.module';
import { ForumModule } from './forum/forum.module';
import { HttpService } from './common/http.service';
import { ReportsModule } from './reports/reports.module';

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
    CategoryModule,
    CourseModule,
    ForumModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
