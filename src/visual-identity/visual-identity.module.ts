import { Module } from '@nestjs/common';
import { VisualIdentityService } from './visual-identity.service';
import { VisualIdentityController } from './visual-identity.controller';
import { N8nModule } from 'src/n8n/n8n.module';

@Module({
  providers: [VisualIdentityService],
  controllers: [VisualIdentityController],
  imports: [N8nModule],
})
export class VisualIdentityModule {}
