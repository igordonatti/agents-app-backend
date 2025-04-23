import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { isPublic } from './auth/decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @isPublic()
  getHello(): string {
    return this.appService.getHello();
  }
}
