import { Controller, Get, Post, Body } from '@nestjs/common';
import { DBService } from './db.service';
import { DB } from './schemas/db.schema';

@Controller('db')
export class DBController {
  constructor(private readonly dbService: DBService) {}

  @Post()
  async create(@Body() dbDto: Partial<DB>) {
    return this.dbService.create(dbDto);
  }

  @Get()
  async findAll(): Promise<DB[]> {
    return this.dbService.findAll();
  }
}