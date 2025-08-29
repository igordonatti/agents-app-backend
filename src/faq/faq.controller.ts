import { Controller, Get, Query } from '@nestjs/common';
import { FaqService } from './faq.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @isPublic()
  async getFaq(@Query('id') id: string) {
    return this.faqService.getFaq(id);
  }
}
