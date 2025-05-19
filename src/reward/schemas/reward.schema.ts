import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  name: string; // 예: "쿠폰", "포인트", "아이템"

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop()
  type: 'POINT' | 'ITEM' | 'COUPON';
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
