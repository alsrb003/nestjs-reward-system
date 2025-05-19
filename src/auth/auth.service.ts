import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(userId: string, password: string): Promise<any> {
    const user = await this.usersService.findByUserId(userId); // userId 기준 검색
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    return user;
  }

  async login(user: any) {
    const plainUser = user.toObject?.() || user._doc || user;

    const payload = {
      userId: plainUser.userId,       // 로그인 ID
      username: plainUser.username,   // 사용자 이름
      role: plainUser.role,
      sub: plainUser._id,             // MongoDB _id
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
