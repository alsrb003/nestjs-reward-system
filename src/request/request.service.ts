import {
    Injectable,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument } from './schemas/request.schema';
import { Model, Types } from 'mongoose';
import { RewardService } from '../reward/reward.service';
import { EventService } from '../event/event.service';

// ✅ ObjectId 변환을 안전하게 처리하는 유틸
function toObjectId(id: string | Types.ObjectId): Types.ObjectId {
    return id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
}

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
        private readonly rewardService: RewardService,
        private readonly eventService: EventService,
    ) { }

    async requestReward(userId: string, eventId: string, rewardId: string) {
        const objectUserId = toObjectId(userId);
        const objectEventId = toObjectId(eventId);
        const objectRewardId = toObjectId(rewardId);

        // ✅ 중복 요청 여부 확인
        const exists = await this.requestModel.findOne({
            userId: objectUserId,
            eventId: objectEventId,
            rewardId: objectRewardId,
        });

        if (exists) {
            throw new ConflictException('이미 요청한 보상입니다.');
        }

        // ✅ 이벤트 조건 검사
        const isEligible = await this.eventService.checkCondition(userId, eventId);

        // ✅ 상태 결정
        const status = isEligible ? 'APPROVED' : 'REJECTED';

        // ✅ 요청 이력 저장
        const record = await new this.requestModel({
            userId: objectUserId,
            eventId: objectEventId,
            rewardId: objectRewardId,
            status,
        }).save();

        // ✅ 조건 충족 시 보상 지급
        if (isEligible) {
            await this.rewardService.giveReward(userId, rewardId);
        }

        return {
            status,
            message: isEligible
                ? '보상이 지급되었습니다.'
                : '보상 조건을 충족하지 않았습니다.',
            request: record,
        };
    }

    async findByUser(userId: string) {
        return this.requestModel
            .find({ userId: toObjectId(userId) }) // ✅ 안전한 ObjectId 변환
            .populate(['eventId', 'rewardId'])
            .exec();
    }

    async findAllRequests(filter: {
        status?: 'APPROVED' | 'REJECTED';
        userId?: string;
        eventId?: string;
    }) {
        const query: any = {};

        if (filter.status) query.status = filter.status;
        if (filter.userId) query.userId = new Types.ObjectId(filter.userId);
        if (filter.eventId) query.eventId = new Types.ObjectId(filter.eventId);

        return this.requestModel
            .find(query)
            .populate(['userId', 'eventId', 'rewardId'])
            .sort({ createdAt: -1 }) // 최신순
            .exec();
    }
}
