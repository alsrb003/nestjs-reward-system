import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  createEvent(@Body() body, @Request() req) {
    return this.eventService.createEvent(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllEvents() {
    return this.eventService.findAll();
  }
}
