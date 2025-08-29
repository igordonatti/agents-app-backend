import { Controller, Get, Param } from '@nestjs/common';
import { AgentsElevenlabsService } from './agents-elevenlabs.service';

@Controller('agents-elevenlabs')
export class AgentsElevenlabsController {
  constructor(
    private readonly agentsElevenlabsService: AgentsElevenlabsService,
  ) {}

  @Get('transcriptions/:id')
  async getTranscriptionsById(@Param('id') id: string) {
    return this.agentsElevenlabsService.getTranscriptionsById(id);
  }
}
