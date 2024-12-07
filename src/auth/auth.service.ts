import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { generateOtp } from './../utils/crypto';
import { EmailService } from 'src/third-party/mail.service';

@Injectable()
export class AuthService {
  private readonly minRequestIntervalMinutes = 2;
  private readonly tokenExpirationMinutes = 15;

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly primsaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const now = new Date();

    const { email, password, name } = signUpDto;

    const existUser = await this.userService.getUserByEmail(signUpDto.email);

    if (existUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + this.tokenExpirationMinutes);

    const user = await this.primsaService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationCode: otp,
        otpExpiry,
        lastOtpSent: now,
      },
    });

    await this.emailService.sendEmail({
      subject: 'Debate Up - Account Verification',
      recipients: [{ name: user.name ?? '', address: user.email }],
      text: `Please verify your email by OTP: ${otp}`,
      html: `<p>Hi${user.name ? ' ' + user.name : ''},</p>
         <p>You may verify your MyApp account using the following OTP: <br />
         <span style="font-size:24px; font-weight: 700;">${otp}</span></p>
         <p>Regards,<br />MyApp</p>`,
    });

    return {
      message:
        'Signup successful. Please verify your email using the OTP sent.',
    };
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

    const tokens = await this.generateUserToken(user.id);
    return {
      ...tokens,
      userId: user.id,
    };
  }

  async generateUserToken(
    userId: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.getUserById(userId);
    const role = user.role;

    const accessToken = this.jwtService.sign(
      { userId, role },
      { expiresIn: '1h' },
    );
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

    return this.generateUserToken(token.userId);
  }

  async storeRefreshToken(token: string, userId: number) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.primsaService.refreshToken.upsert({
      where: { token },
      update: { expiryDate },
      create: { token, userId, expiryDate },
    });
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.primsaService.user.findFirst({
      where: { id: userId },
    });
    return user;
  }

  async generateEmailVerification(userId: number) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist`);
    }
  }

  async verifyEmailCode(token: string) {
    const user = await this.primsaService.user.findFirst({
      where: { verificationCode: token },
    });

    if (!user) {
      throw new BadRequestException('User not found or OTP invalid');
    }

    if (user.otpExpiry < new Date()) {
      throw new BadRequestException(
        'OTP has expired. Please request a new OTP',
      );
    }

    await this.primsaService.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        otpExpiry: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async resendOtp(email: string) {
    const user = await this.primsaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const timeSinceLastOTP = user.lastOtpSent
      ? new Date().getTime() - new Date(user.lastOtpSent).getTime()
      : null;

    if (
      timeSinceLastOTP &&
      timeSinceLastOTP < this.minRequestIntervalMinutes * 60 * 1000
    ) {
      throw new BadRequestException(
        `User ${user.email} can only resend otp after 2 minutes`,
      );
    }

    const otp = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + this.tokenExpirationMinutes);

    await this.primsaService.user.update({
      where: { email },
      data: { verificationCode: otp, otpExpiry, lastOtpSent: new Date() },
    });

    await this.emailService.sendEmail({
      subject: 'Debate Up - Account Verification',
      recipients: [{ name: user.name ?? '', address: user.email }],
      text: `Your new OTP is: ${otp}`,
      html: `<p>Hi${user.name ? ' ' + user.name : ''},</p>
             <p>Your new OTP is: <br />
             <span style="font-size:24px; font-weight: 700;">${otp}</span></p>
             <p>It is valid for 10 minutes.</p>
             <p>Regards,<br />MyApp</p>`,
    });

    return { message: 'OTP has been resent to your email' };
  }
}
