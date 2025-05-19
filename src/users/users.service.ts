import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async findByUserId(userId: string): Promise<User | null> {
        return this.userModel.findOne({ userId }).exec();
    }

    // 유저 생성 (비밀번호 해싱 포함)
    async createUser(
        userId: string,
        username: string,
        password: string,
        role: UserRole = UserRole.USER,
    ): Promise<User> {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({ userId, username, passwordHash, role });
        return newUser.save();
    }

    // 모든 유저 조회 (테스트용)
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }
}
