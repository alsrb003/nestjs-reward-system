import { Body, Controller, Get, Post, Query, Request as Req, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  requestReward(@Body() body: { eventId: string; rewardId: string }, @Req() req) {
    return this.requestService.requestReward(req.user.userId, body.eventId, body.rewardId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  getMyRequests(@Req() req) {
    return this.requestService.findByUser(req.user.userId);
  }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly requestService: RequestService) {}

  @Get('requests')
  @Roles('ADMIN', 'AUDITOR') // 관리자 또는 감사자만
  async getAllRequests(
    @Query('status') status?: 'APPROVED' | 'REJECTED',
    @Query('userId') userId?: string,
    @Query('eventId') eventId?: string,
  ) {
    return this.requestService.findAllRequests({ status, userId, eventId });
  }
}

