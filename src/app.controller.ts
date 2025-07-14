import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { isPublic } from './auth/decorators/is-public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Health check',
    description: 'Endpoint para verificar se a aplicação está funcionando',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação funcionando corretamente',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  @Get()
  @isPublic()
  getHello(): string {
    return this.appService.getHello();
  }
}
