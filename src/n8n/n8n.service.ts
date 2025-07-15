import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import * as FormData from 'form-data';

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  private readonly n8nBaseUrl: string;
  private readonly n8nApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Carrega as configurações do .env na inicialização do serviço
    this.n8nBaseUrl = this.configService.get<string>('N8N_BASE_URL');
    this.n8nApiKey = this.configService.get<string>('N8N_API_KEY');
  }

  /**
   * Dispara um webhook (POST) no n8n.
   * @param workflowPath - O path específico do webhook (ex: 'meu-workflow/1234-abcd')
   * @param payload - O corpo (body) de dados a ser enviado para o n8n.
   * @returns Uma Promise com a resposta do workflow (se houver).
   */
  async postResource<T>(workflowPath: string, payload: T): Promise<T> {
    const url = `${this.n8nBaseUrl}/${workflowPath}`;

    this.logger.log(`Disparando webhook (POST) para: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: { 'X-N8N-API-KEY': this.n8nApiKey },
        }),
      );
      this.logger.log(
        `Webhook (POST) disparado com sucesso para ${workflowPath}`,
      );
      return response.data as T;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `Falha ao disparar webhook (POST): ${error.message}`,
          error.stack,
        );
        throw new Error(`Falha na comunicação com o n8n: ${error.message}`);
      }
      this.logger.error('Erro inesperado ao disparar webhook (POST)', error);
      throw error;
    }
  }

  /**
   * Dispara um webhook (DELETE) no n8n.
   * @param workflowPath - O path específico do webhook (ex: 'meu-workflow/1234-abcd')
   * @param payload - O corpo (body) de dados a ser enviado para o n8n.
   * @returns Uma Promise com a resposta do workflow (se houver).
   */
  async deleteResource<T>(workflowPath: string, payload: T): Promise<T> {
    const url = `${this.n8nBaseUrl}/${workflowPath}`;
    this.logger.log(`Removendo recurso (DELETE) em: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.delete(url, {
          headers: { 'X-N8N-API-KEY': this.n8nApiKey },
          data: payload,
        }),
      );
      this.logger.log(`Recurso removido com sucesso em ${workflowPath}`);
      return response.data as T;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `Falha ao remover recurso: ${error.message}`,
          error.stack,
        );
        throw new Error(`Falha na comunicação com o n8n: ${error.message}`);
      }
      this.logger.error('Erro inesperado ao remover recurso', error);
      throw error;
    }
  }

  /**
   * Dispara um webhook (GET) no n8n.
   * @param workflowPath - O path específico do webhook.
   * @param params - Query parameters a serem enviados na URL.
   * @returns Uma Promise com os dados retornados pelo workflow.
   */
  async getResource<T>(
    workflowPath: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const url = `${this.n8nBaseUrl}/${workflowPath}`;
    this.logger.log(`Buscando dados (GET) de: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService
          .get<T>(url, {
            // Usamos o método GET
            headers: { 'X-N8N-API-KEY': this.n8nApiKey },
            params: params, // Axios serializa isso para ?key=value&...
          })
          .pipe(map((axiosResponse) => axiosResponse.data)), // Extrai apenas o corpo da resposta
      );
      this.logger.log(`Dados recebidos com sucesso de ${workflowPath}`);
      return response as T;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `Falha ao buscar dados do webhook: ${error.message}`,
          error.stack,
        );
        throw new Error(`Falha na comunicação com o n8n: ${error.message}`);
      }
      this.logger.error('Erro inesperado ao buscar dados do webhook', error);
      throw error;
    }
  }

  /**
   * Dispara um webhook (PATCH) no n8n.
   * @param workflowPath - O path específico do webhook.
   * @param payload - O corpo (body) de dados a ser enviado para o n8n.
   * @returns Uma Promise com os dados retornados pelo workflow.
   */
  async patchResource<T>(workflowPath: string, payload: T): Promise<T> {
    const url = `${this.n8nBaseUrl}/${workflowPath}`;
    this.logger.log(`Atualizando dados (PATCH) em: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.patch<T>(url, payload, {
          headers: { 'X-N8N-API-KEY': this.n8nApiKey },
        }),
      );
      this.logger.log(`Dados atualizados com sucesso em ${workflowPath}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `Falha ao atualizar dados do webhook: ${error.message}`,
          error.stack,
        );
        throw new Error(`Falha na comunicação com o n8n: ${error.message}`);
      }
      this.logger.error('Erro inesperado ao atualizar dados do webhook', error);
      throw error;
    }
  }

  /**
   * Envia um arquivo (POST) para o n8n usando FormData.
   * @param workflowPath - O path específico do webhook.
   * @param file - Buffer do arquivo.
   * @param filename - Nome original do arquivo.
   * @param additionalData - Dados adicionais a serem enviados junto com o arquivo.
   * @returns Uma Promise com a resposta do workflow.
   */
  async postFile<T>(
    workflowPath: string,
    file: Buffer,
    filename: string,
    additionalData?: Record<string, any>,
  ): Promise<T> {
    const url = `${this.n8nBaseUrl}/${workflowPath}`;
    this.logger.log(`Enviando arquivo (POST) para: ${url}`);

    try {
      const formData = new FormData();

      // Adiciona o arquivo ao FormData
      formData.append('files', file, filename);

      // Adiciona dados adicionais se fornecidos
      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          formData.append(key, additionalData[key]);
        });
      }

      const response = await firstValueFrom(
        this.httpService.post(url, formData, {
          headers: {
            'X-N8N-API-KEY': this.n8nApiKey,
            Accept: 'application/json',
            'Accept-Charset': 'utf-8',
            ...formData.getHeaders(),
          },
        }),
      );
      this.logger.log(`Arquivo enviado com sucesso para ${workflowPath}`);
      return response.data as T;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `Falha ao enviar arquivo: ${error.message}`,
          error.stack,
        );
        throw new Error(`Falha na comunicação com o n8n: ${error.message}`);
      }
      this.logger.error('Erro inesperado ao enviar arquivo', error);
      throw error;
    }
  }

  /**
   * Envia múltiplos arquivos (POST) para o n8n usando FormData.
   * @param workflowPath - O path específico do webhook.
   * @param files - Array com informações dos arquivos.
   * @param agentId - ID do agente.
   * @returns Uma Promise com a resposta do workflow.
   */
  async postFiles<T>(
    workflowPath: string,
    files: Array<{
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    }>,
    agentId: string,
  ): Promise<T> {
    const url = `${this.n8nBaseUrl}/${workflowPath}`;
    this.logger.log(`Enviando ${files.length} arquivo(s) (POST) para: ${url}`);

    try {
      const formData = new FormData();

      // Adiciona cada arquivo ao FormData com nome codificado corretamente
      files.forEach((file) => {
        // Mantém o nome original com encoding UTF-8 correto
        formData.append('files', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      });

      // Adiciona o ID do agente
      formData.append('agentId', agentId);

      const response = await firstValueFrom(
        this.httpService.post(url, formData, {
          headers: {
            'X-N8N-API-KEY': this.n8nApiKey,
            ...formData.getHeaders(),
          },
        }),
      );
      this.logger.log(
        `${files.length} arquivo(s) enviado(s) com sucesso para ${workflowPath}`,
      );
      return response.data as T;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `Falha ao enviar arquivos: ${error.message}`,
          error.stack,
        );
        if (error.response.status === 403) {
          return {
            message: 'Arquivo já existe na base de conhecimento',
          } as T;
        }
        throw new Error(`Falha na comunicação com o n8n: ${error.message}`);
      }
      this.logger.error('Erro inesperado ao enviar arquivos', error);
      throw error;
    }
  }
}
