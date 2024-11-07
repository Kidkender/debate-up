import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly primsaService: PrismaService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto;

    const existUser = await this.userService.getUserByEmail(signUpDto.email);

    if (existUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    this.userService.createUser(email, hashedPassword, name);
  }

  async login(credential: LoginDto) {
    const { email, password } = credential;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found with email ' + email);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Password mismatch');
    }

    const tokens = this.generateUserToken(user.id);
    return {
      ...tokens,
      userId: user.id,
    };
  }

  async generateUserToken(
    userId: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, userId);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.primsaService.refreshToken.findFirst({
      where: {
        token: refreshToken,
        expiryDate: { gte: new Date() },
      },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    await this.primsaService.refreshToken.delete({ where: { id: token.id } });

    return this.generateUserToken(token.userId);
  }

  async storeRefreshToken(token: string, userId: number) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.primsaService.refreshToken.create({
      data: {
        token,
        userId,
        expiryDate,
      },
    });
  }
}
