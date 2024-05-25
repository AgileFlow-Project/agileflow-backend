import { IsString, Matches } from 'class-validator';
import { passwordErrorMessage, passwordRegex } from './users.validators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @Matches(passwordRegex, { message: passwordErrorMessage })
  newPassword: string;
}
