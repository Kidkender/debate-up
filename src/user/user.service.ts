import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User, UserStatus, UserViolation } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActionUser } from './dtos/create-action.dto';

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

  async getUserById(id: number): Promise<User> {
    const user = await this.prismaService.user.findFirst({ where: { id } });
    if (!user) {
      throw new BadRequestException(`User ${id} not found`);
    }
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async bannedUser(data: CreateActionUser) {
    const user = await this.getUserById(data.userId);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { status: UserStatus.BANNED },
    });

    await this.prismaService.userViolation.create({
      data: {
        userId: user.id,
        reason: data.reason,
        actionTaken: UserStatus.BANNED,
      },
    });

    this.logger.log(`User ${user.id} is banned `);
  }

  async unlockUser(userId: number) {
    const user = await this.getUserById(userId);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { status: UserStatus.SUSPENDED },
    });

    this.logger.log(`Unlock ${userId} `);
  }

  async getUserViolent(): Promise<UserViolation[]> {
    return this.prismaService.userViolation.findMany();
  }
}
