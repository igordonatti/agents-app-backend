import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import {
  ApiFindUserByEmail,
  ApiCreateUser,
} from './decorators/api-docs.decorator';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiFindUserByEmail()
  @Get('findByEmail')
  findByEmail(@Body('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @ApiCreateUser()
  @isPublic()
  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user.email, user.password, user.name);
  }
}
