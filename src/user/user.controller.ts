import { Controller, Get, Post, Body, Patch, HttpCode, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WebResponse } from '../common/web-response.dto';
import { UserResponse } from './dto/response-user';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from '../common/auth.decorators';
import { Users } from './entities/user.entity';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(201)
  async register(@Body() registerUserDto: RegisterUserDto): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(registerUserDto);

    return {
      success: true,
      data: result
    };
  }

  @Get('current')
  @HttpCode(200)
  async get(@Auth() user: Users): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user);
    return {
      success: true,
      data: result
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(loginUserDto);

    return {
      success: true,
      data: result
    }
  }

  @Patch('current')
  @HttpCode(200)
  async update(@Auth() user: Users, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.userService.update(user, updateUserDto);

    return {
      success: true,
      data: result
    };
  }

  @Delete('current')
  @HttpCode(200)
  async logout(@Auth() user: Users) {
    const result = await this.userService.logout(user);
    return {
      success: true,
      data: result
    }
  }
}
