import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { UserRole } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // 로그인
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // 회원가입
  @Post('register')
async register(@Body() body: {
    userId: string;     // 사용자 ID (로그인용)
    username: string;   // 사용자 이름
    password: string;
    role?: UserRole;
  }) {
  const user = await this.usersService.createUser(
    body.userId,
    body.username,
    body.password,
    body.role ?? UserRole.USER,
  );
  return { message: '회원가입 성공', user };
}

  // JWT 보호 라우트 테스트용
  @UseGuards(JwtAuthGuard)
  @Post('test-protected')
  getProtected(@Request() req) {
    return { message: 'Access granted', user: req.user };
  }
}
