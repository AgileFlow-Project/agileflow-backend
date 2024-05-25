import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { TokenPairEntity } from './entities/token-pair.entity';
import { LoginDto } from './dto/login.dto';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/schema/user.schema';

/**
 * Service responsible for authentication.
 * @version 1.0.0
 * @see UsersRepository
 * @see JwtService
 * @see ConfigService
 * @see User
 * @see TokenPairEntity
 * @see LoginDto
 * @see UnauthorizedException
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Return user with given username and matching password.
   * @param username User's username.
   * @param password User's password.
   */
  public async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(username);

    if (user && (await compare(password, user.password))) return user;

    return null;
  }

  public async refreshTokens(refreshToken: string): Promise<TokenPairEntity> {
    let id, type;

    // Decode refresh token and extract user id and token type from its payload.
    try {
      const payload = await this.jwtService.decode(refreshToken);
      id = payload['id'];
      type = payload['type'];
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Check token type and user id.
    if (type !== 'refresh' || id === undefined)
      throw new UnauthorizedException('Invalid refresh token.');

    // Check if user with given id exists.
    const user = await this.userRepository.getUserById(id);
    if (user === null)
      throw new UnauthorizedException('Invalid refresh token.');

    return this.createTokenPair(user);
  }

  public async login(loginDto: LoginDto): Promise<TokenPairEntity> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (user === null) throw new UnauthorizedException('Invalid credentials.');
    return this.createTokenPair(user);
  }

  private async createTokenPair(user: User): Promise<TokenPairEntity> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        id: user._id,
        email: user.email,
        roles: user.roles,
        type: 'access',
      }),
      this.jwtService.signAsync(
        { id: user._id, type: 'refresh' },
        {
          expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_TTL'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
