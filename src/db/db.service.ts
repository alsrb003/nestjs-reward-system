import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB, DBDocument } from './schemas/db.schema';
import { Model } from 'mongoose';

@Injectable()
export class DBService {
  constructor(@InjectModel(DB.name) private dbModel: Model<DBDocument>) {}

  async create(db: Partial<DB>): Promise<DB> {
    const createdDB = new this.dbModel(db);
    return createdDB.save();
  }

  async findAll(): Promise<DB[]> {
    return this.dbModel.find().exec();
  }
}