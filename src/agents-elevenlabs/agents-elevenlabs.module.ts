import { Module } from '@nestjs/common';
import { AgentsElevenlabsController } from './agents-elevenlabs.controller';
import { AgentsElevenlabsService } from './agents-elevenlabs.service';
import { N8nModule } from 'src/n8n/n8n.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AgentsElevenlabsController],
  providers: [AgentsElevenlabsService],
  imports: [N8nModule, ConfigModule],
})
export class AgentsElevenlabsModule {}
