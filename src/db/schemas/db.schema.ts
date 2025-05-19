import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DBDocument = DB & Document;

@Schema()
export class DB {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const DBSchema = SchemaFactory.createForClass(DB);