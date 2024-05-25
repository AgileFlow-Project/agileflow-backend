import { ApiProperty } from '@nestjs/swagger';

/**
 * Token pair entity.
 * @property accessToken Access token.
 * @property refreshToken Refresh token.
 */
export class TokenPairEntity {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
