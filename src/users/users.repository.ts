import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UsersRepository {
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async getUsers(): Promise<User[]> {
    return this.userModel.find().select('-__v').lean().exec();
  }

  public async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-__v').lean().exec();
  }

  public async existsByEmail(email: string, userId?: string): Promise<boolean> {
    return !!(await this.userModel
      .exists({ email, _id: { $ne: userId } })
      .exec());
  }

  public async createUser(createUserDto: Partial<User>): Promise<User> {
    return new this.userModel(createUserDto, '-__v', { lean: true }).save();
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('-__v').lean().exec();
  }

  public async updateUser(
    id: string,
    updateUserDto: Partial<User>,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        fields: '-__v',
        new: true,
      })
      .lean()
      .exec();
  }

  public async deleteUser(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
