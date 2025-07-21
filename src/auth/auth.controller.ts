import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { isPublic } from './decorators/is-public.decorator';
import { AuthService } from './auth.service';
import { AuthRequest } from './models/AuthRequest';
import { LoginDto } from './dto/login.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Autentica um usuário e retorna um token JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'user_123' },
        email: { type: 'string', example: 'usuario@exemplo.com' },
        name: { type: 'string', example: 'João Silva' },
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  @isPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'Validar token JWT',
    description: 'Valida se um token JWT é válido',
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        sub: { type: 'string', example: 'user_123' },
        email: { type: 'string', example: 'usuario@exemplo.com' },
        iat: { type: 'number', example: 1640995200 },
        exp: { type: 'number', example: 1640998800 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  @isPublic()
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  validateToken(@Body() body: ValidateTokenDto) {
    return this.authService.validateToken(body.token);
  }

  @isPublic()
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    return await this.authService.forgotPassword(email);
  }

  @isPublic()
  @Post('reset-password')
  async resetPassword(
    @Body() { token, password }: { token: string; password: string },
  ) {
    return await this.authService.resetPassword(token, password);
  }
}
