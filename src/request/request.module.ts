import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './schemas/request.schema';
import { RequestController, AdminController } from './request.controller';
import { RequestService } from './request.service';
import { RewardModule } from '../reward/reward.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    RewardModule, EventModule,
  ],
  controllers: [RequestController, AdminController],
  providers: [RequestService],
})
export class RequestModule {}
