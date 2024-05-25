import { Controller, Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorEntity } from '../app.entity';
import { AuthService } from './auth.service';
import { TokenPairEntity } from './entities/token-pair.entity';
import { LoginDto, RefreshDto } from './dto/login.dto';
import { Public } from './guards/auth.guard';

@ApiTags('auth')
@ApiOkResponse({
  type: TokenPairEntity,
  description: 'Access & refresh token pair.',
})
@ApiUnauthorizedResponse({
  type: ErrorEntity,
  description: 'Invalid refresh token.',
})
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user.' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: TokenPairEntity,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<TokenPairEntity> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh access token.' })
  @ApiResponse({
    status: 200,
    description: 'The access token has been successfully refreshed.',
    type: TokenPairEntity,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @Body() refreshDto: RefreshDto,
  ): Promise<TokenPairEntity> {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }
}
