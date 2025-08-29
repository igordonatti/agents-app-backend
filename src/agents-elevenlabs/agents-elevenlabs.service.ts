import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { N8nService } from 'src/n8n/n8n.service';
import { Transcription } from './types/transcriptionInterface';

@Injectable()
export class AgentsElevenlabsService {
  private readonly devOrProd: boolean;
  constructor(
    private readonly n8nService: N8nService,
    private readonly configService: ConfigService,
  ) {
    this.devOrProd = this.configService.get('DEV_DECIDER');
  }
  async getTranscriptionsById(id: string) {
    const workflowPath = `a2bf5357-c174-485b-80b8-7f7abd578422${this.devOrProd === true ? '/dev' : ''}/transcriptions/elevenlabs/${id}`;
    const data: Transcription[] =
      await this.n8nService.getResource(workflowPath);

    console.log(data);

    return data;
  }
}
