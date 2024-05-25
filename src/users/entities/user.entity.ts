import { Exclude } from 'class-transformer';
import { Gender } from '../users.type';
import { Role } from 'src/auth/role.enum';
import { User } from '../schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly firstName: string;
  @ApiProperty()
  readonly lastName: string;
  @ApiProperty()
  readonly gender?: Gender;
  @Exclude()
  readonly password: string;
  @Exclude()
  readonly isBanned: boolean;
  @ApiProperty()
  readonly roles: Role[];
  @ApiProperty()
  readonly createdAt: Date;
  @ApiProperty()
  readonly updatedAt: Date;

  public static fromInstance(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.gender,
      user.password,
      user.isBanned,
      user.roles,
      user.createdAt,
      user.updatedAt,
    );
  }

  private constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    gender: Gender | undefined,
    password: string,
    isBanned: boolean,
    roles: Role[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.password = password;
    this.isBanned = isBanned;
    this.roles = roles;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
