// clients/customClient.ts
import axios from 'axios';
import { BaseLLMClient } from '../baseClient';
import { AgentConfig, Message, RAGContext, AgentError } from '../types';
import { LLMResponse } from '../interfaces';

export class CustomClient extends BaseLLMClient {
  private endpoint!: string;
  private apiKey!: string;

  protected async initializeClient(): Promise<void> {
    if (!this.config.tool_options?.custom_vendor) {
      throw new AgentError('Custom vendor configuration is required', 'custom');
    }
    
    this.endpoint = this.config.tool_options.custom_vendor.custom_api_endpoint;
    this.apiKey = this.config.tool_options.custom_vendor.custom_api_key;
  }

  protected vendorSpecificValidation(config: AgentConfig): void {
    if (!config.tool_options?.custom_vendor) {
      throw new AgentError('Custom vendor configuration is required', 'custom');
    }
    
    const { custom_api_endpoint, custom_api_key } = config.tool_options.custom_vendor;
    if (!custom_api_endpoint || !custom_api_key) {
      throw new AgentError(
        'Custom vendor requires both custom_api_endpoint and custom_api_key',
        'custom'
      );
    }
  }

  async *sendMessage(
    messages: Message[],
    userMessage: string,
    ragContext?: RAGContext
  ): AsyncGenerator<LLMResponse> {
    try {
      const response = await axios.post(
        this.endpoint,
        {
          model: this.config.model_id,
          messages,
          ...this.getDefaultParams(),
          stream: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          responseType: 'stream'
        }
      );

      const stream = response.data;

      for await (const chunk of stream) {
        const lines = chunk.toString().split('\n')
          .filter((line: string) => line.startsWith('data: '));

        for (const line of lines) {
          try {
            const data = line.slice(6); // Remove 'data: '
            if (data === '[DONE]') continue;

            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';

            yield {
              content,
              shouldStream: true
            };
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    } catch (error) {
      throw new AgentError(
        `Custom vendor API request failed: ${error.message}`,
        'custom',
        error.response?.status?.toString(),
        error.response?.data
      );
    }
  }
}
