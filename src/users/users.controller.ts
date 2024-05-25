import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Put,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ErrorEntity } from 'src/app.entity';
import { Public } from 'src/auth/guards/auth.guard';
import { LocationHeaderInterceptor } from 'src/app.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { ObjectIdValidationPipe } from 'src/app.pipe';
import { PartialUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthUser } from 'src/auth/decorators/auth.decorator';
import { RequestUser } from 'src/auth/auth.type';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ type: UserEntity, description: 'Created user' })
  @ApiBadRequestResponse({
    type: ErrorEntity,
    description: 'Validation error',
  })
  @Post()
  @Public()
  @UseInterceptors(new LocationHeaderInterceptor('api/v1/users'))
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return UserEntity.fromInstance(
      await this.usersService.create(createUserDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: [UserEntity], description: 'List of fetched users' })
  @ApiUnauthorizedResponse({
    type: ErrorEntity,
    description: 'Not authenticated',
  })
  public async findAll(): Promise<UserEntity[]> {
    return (await this.usersService.findAll()).map(UserEntity.fromInstance);
  }

  @ApiOkResponse({ type: UserEntity, description: 'Fetched user' })
  @ApiForbiddenResponse({
    type: ErrorEntity,
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({ type: ErrorEntity, description: 'User not found' })
  @Get(':id')
  public async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<UserEntity> {
    return UserEntity.fromInstance(await this.usersService.findOne(id));
  }

  @ApiOkResponse({ type: UserEntity, description: 'Updated user' })
  @ApiBadRequestResponse({
    type: ErrorEntity,
    description: 'Validation error',
  })
  @ApiForbiddenResponse({
    type: ErrorEntity,
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({ type: ErrorEntity, description: 'User not found' })
  @Put(':id')
  public async replace(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return UserEntity.fromInstance(
      await this.usersService.update(id, updateUserDto),
    );
  }

  @ApiOkResponse({ type: UserEntity, description: 'Updated user' })
  @ApiBadRequestResponse({
    type: ErrorEntity,
    description: 'Validation error',
  })
  @ApiForbiddenResponse({
    type: ErrorEntity,
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({ type: ErrorEntity, description: 'User not found' })
  @Patch(':id')
  public async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateUserDto: PartialUpdateUserDto,
  ): Promise<UserEntity> {
    return UserEntity.fromInstance(
      await this.usersService.update(id, updateUserDto),
    );
  }

  @ApiNoContentResponse({ description: 'Deleted user' })
  @ApiForbiddenResponse({
    description: 'Forbidden response',
    type: ErrorEntity,
  })
  @ApiNotFoundResponse({ type: ErrorEntity, description: 'User not found' })
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    await this.usersService.remove(id);
  }
}

/**
 * Controller responsible for managing current user.
 * @version 1.0.0
 * @see UsersService
 * @see UserEntity
 * @see UpdateUserDto
 * @see PartialUpdateUserDto
 * @see RequestUser
 * @see AuthUser
 */
@ApiBearerAuth()
@ApiTags('users')
@Controller('users/me')
@ApiUnauthorizedResponse({
  type: ErrorEntity,
  description: 'Not authenticated',
})
@ApiNotFoundResponse({ type: ErrorEntity, description: 'User not found' })
export class UsersMeController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserEntity, description: 'Fetched user' })
  public async findOne(@AuthUser() user: RequestUser): Promise<UserEntity> {
    return UserEntity.fromInstance(await this.usersService.findOne(user.id));
  }

  @Put()
  @ApiOkResponse({ type: UserEntity, description: 'Updated user' })
  @ApiBadRequestResponse({
    type: ErrorEntity,
    description: 'Validation error',
  })
  public async replace(
    @AuthUser() user: RequestUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return UserEntity.fromInstance(
      await this.usersService.update(user.id, updateUserDto),
    );
  }

  @Patch()
  @ApiOkResponse({ type: UserEntity, description: 'Updated user' })
  @ApiBadRequestResponse({
    type: ErrorEntity,
    description: 'Validation error',
  })
  public async update(
    @AuthUser() user: RequestUser,
    @Body() updateUserDto: PartialUpdateUserDto,
  ): Promise<UserEntity> {
    return UserEntity.fromInstance(
      await this.usersService.update(user.id, updateUserDto),
    );
  }

  @Delete()
  @ApiNoContentResponse({ description: 'Deleted user' })
  @ApiForbiddenResponse({
    description: 'Forbidden response.',
    type: ErrorEntity,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@AuthUser() user: RequestUser): Promise<void> {
    await this.usersService.remove(user.id);
  }
}
