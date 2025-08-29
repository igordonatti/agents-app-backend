import { Controller, Get, Param } from '@nestjs/common';
import { AgentsElevenlabsService } from './agents-elevenlabs.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('agents-elevenlabs')
export class AgentsElevenlabsController {
  constructor(
    private readonly agentsElevenlabsService: AgentsElevenlabsService,
  ) {}

  @Get('transcriptions/:id')
  @isPublic()
  async getTranscriptionsById(@Param('id') id: string) {
    return this.agentsElevenlabsService.getTranscriptionsById(id);
  }
}
