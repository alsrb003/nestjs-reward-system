import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB, DBSchema } from './schemas/db.schema';
import { DBService } from './db.service';
import { DBController } from './db.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: DB.name, schema: DBSchema }])],
  controllers: [DBController],
  providers: [DBService],
})
export class DBModule {}