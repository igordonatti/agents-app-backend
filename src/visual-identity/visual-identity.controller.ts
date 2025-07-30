import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { N8nService } from 'src/n8n/n8n.service';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller('visual-identity')
export class VisualIdentityController {
  constructor(private readonly n8nService: N8nService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      preservePath: true,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: MulterFile[],
    @Body() data: { idAgent: string; idFolder: string },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Arquivos não foram enviados');
    }

    if (!data.idAgent || !data.idFolder) {
      throw new BadRequestException('IDs do agente é obrigatório');
    }
    const fileData = files.map((file) => ({
      buffer: file.buffer,
      originalname: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      mimetype: file.mimetype,
      size: file.size,
    }));

    const workflowPath = '/agents/img';

    console.log('data: ', data.idFolder, data.idAgent);

    const response = await this.n8nService.postFiles(
      workflowPath,
      fileData,
      data.idAgent,
    );

    // Verifica se o arquivo já existe
    if (response && typeof response === 'object' && 'message' in response) {
      const responseObj = response as { message: string };
      if (responseObj.message === 'Arquivo já existe na base de conhecimento') {
        throw new ConflictException(
          'Arquivo já existe na base de conhecimento',
        );
      }
    }

    return response;
  }

  @Get(':idAgent')
  async getVisualIdentity(@Param('idAgent') idAgent: string) {
    const workflowPath = `4e477042-204e-4a07-aa71-c603d31e1ba3/agents/img/${idAgent}`;

    const response = await this.n8nService.getResource(workflowPath);

    return response;
  }
}
