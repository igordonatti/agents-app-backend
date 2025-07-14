import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateUserDto } from './dto/createUser.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Buscar usuário por email',
    description: 'Busca um usuário pelo endereço de email',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@exemplo.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'user_123' },
        email: { type: 'string', example: 'usuario@exemplo.com' },
        name: { type: 'string', example: 'João Silva' },
        created_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiBearerAuth('JWT-auth')
  @Get('findByEmail')
  findByEmail(@Body('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'user_123' },
        email: { type: 'string', example: 'usuario@exemplo.com' },
        name: { type: 'string', example: 'João Silva' },
        created_at: { type: 'string', format: 'date-time' },
        message: { type: 'string', example: 'User created successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou usuário já existe',
  })
  @isPublic()
  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user.email, user.password, user.name);
  }
}
