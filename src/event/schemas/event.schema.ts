import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ enum: ['LOGIN_COUNT', 'INVITE_COUNT'], required: true })
  conditionType: 'LOGIN_COUNT' | 'INVITE_COUNT'; // ✅ 조건 타입

  @Prop({ required: true })
  conditionValue: number; // ✅ 조건 기준값 (예: 3일, 5명 등)

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
