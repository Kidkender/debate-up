import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import config, { ConfigType } from './config/config';
import { CourseModule } from './course/course.module';
import { ForumModule } from './forum/forum.module';
import { LessonModule } from './lesson/lesson.module';
import { PracticeModule } from './practice/practice.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { ResourceModule } from './resource/resource.module';
import { ThirdPartyModule } from './third-party/thirdParty.module';
import { UserModule } from './user/user.module';

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
    PracticeModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
