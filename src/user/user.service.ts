import { HttpException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/response-user';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectRepository(Users) private userRepository: Repository<Users>
  ) { }

  async register(registerUserDto: RegisterUserDto): Promise<UserResponse> {
    this.logger.info(`Register new User ${JSON.stringify(registerUserDto)}`);

    const req: RegisterUserDto = this.validationService.validate(
      UserValidation.REGISTER,
      registerUserDto
    );

    const userWithSameUsername = await this.userRepository
      .findOne({
        where: { username: req.username }
      });

    if (userWithSameUsername) {
      throw new HttpException('Username already exist', 400);
    }

    req.password = await bcrypt.hash(req.password, 10);
    const user = await this.userRepository.save(req);

    return {
      username: user.username,
      name: user.name
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponse> {
    this.logger.info(`User ${JSON.stringify(loginUserDto)}`);

    const req: LoginUserDto = this.validationService.validate(
      UserValidation.LOGIN,
      loginUserDto
    );

    const existingUser = await this.userRepository
      .findOne({
        where: {
          username: req.username,
        }
      });

    if (!existingUser) {
      throw new HttpException('Password atau username salah', 401);
    }

    const password = await bcrypt.compare(req.password, existingUser.password);

    if (!password) {
      throw new HttpException('Password atau username salah', 401);
    }

    const token = randomUUID();
    await this.userRepository.update(existingUser.username, {
      token: token
    });

    return {
      username: existingUser.username,
      name: existingUser.name,
      token
    }
  }

  async get(user: Users): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name
    };
  }

  async update(user: Users, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    this.logger.info(`Update user ${JSON.stringify(updateUserDto)}`);

    this.validationService.validate(
      UserValidation.UPDATE,
      updateUserDto
    );


    if (updateUserDto.name) {
      user.name = updateUserDto.name
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const result = await this.userRepository.save({
      ...user
    });

    return {
      username: result.username,
      name: result.name
    };
  }

  async logout(user: Users): Promise<UserResponse> {
    const result = await this.userRepository.save({
      username: user.username,
      token: ''
    })

    return {
      username: result.username,
      name: result.name
    }
  }
}
