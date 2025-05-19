import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async createReward(data: {
    name: string;
    quantity: number;
    eventId: string;
    type: 'POINT' | 'ITEM' | 'COUPON';
  }): Promise<Reward> {
    return new this.rewardModel({
      ...data,
      eventId: new Types.ObjectId(data.eventId),
    }).save();
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    return this.rewardModel
      .find({ eventId: new Types.ObjectId(eventId) })
      .exec();
  }

  async giveReward(userId: string, rewardId: string) {
    // 실제로는 포인트 지급, 아이템 추가, 수량 감소 등 수행
    // 예시는 단순 로그 처리
    console.log(`✅ ${userId}에게 보상 ${rewardId} 지급 완료`);
  }
}
