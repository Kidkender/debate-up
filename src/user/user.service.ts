import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    return user;
  }

  async createUser(email: string, password: string, name: string) {
    const user = await this.prismaService.user.create({
      data: {
        email: email,
        password: password,
        name: name,
      },
    });

    this.logger.log(`Create user with email ${user.email} successfully`);
  }
}
