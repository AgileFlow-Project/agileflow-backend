import { IsString, Matches } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import { passwordErrorMessage, passwordRegex } from './users.validators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends UpdateUserDto {
  @ApiProperty()
  @IsString()
  @Matches(passwordRegex, { message: passwordErrorMessage })
  password: string;
}
