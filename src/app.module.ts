import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 설정 (다른 모듈에서 import 불필요)
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    DBModule,
    AuthModule, EventModule, RewardModule, RequestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
