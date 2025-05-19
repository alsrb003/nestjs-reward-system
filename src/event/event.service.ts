import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(data: Partial<Event>): Promise<Event> {
    const created = new this.eventModel(data);
    return created.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async checkCondition(userId: string, eventId: string): Promise<boolean> {
    // ✅ 실제로는 이벤트 조건 타입별로 로직을 분기해야 함
    // 예시: 로그인 3일 연속, 친구 초대 5명 등
    // 지금은 테스트용으로 무조건 true 리턴
    return true;
  }
}
