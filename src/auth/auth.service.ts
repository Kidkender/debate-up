import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signup(signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto;

    const existUser = await this.userService.getUserByEmail(signUpDto.email);

    if (existUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    this.userService.createUser(email, hashedPassword, name);
  }
}
