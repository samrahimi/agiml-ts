// clients/openaiClient.ts
import OpenAI from 'openai';
import { BaseLLMClient } from '../baseClient';
import { AgentConfig, Message, RAGContext, AgentError } from '../types';
import { LLMResponse } from '../interfaces';

export class OpenAIClient extends BaseLLMClient {
  private client!: OpenAI;

  protected async initializeClient(): Promise<void> {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  protected vendorSpecificValidation(config: AgentConfig): void {
    if (!process.env.OPENAI_API_KEY) {
      throw new AgentError('OpenAI API key is required', 'openai');
    }
  }

  async *sendMessage(
    messages: Message[],
    userMessage: string,
    ragContext?: RAGContext
  ): AsyncGenerator<LLMResponse> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.config.model_id,
        messages,
        ...this.getDefaultParams(),
        stream: true
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        yield {
          content,
          shouldStream: true
        };
      }
    } catch (error) {
      throw new AgentError(
        `OpenAI inference failed: ${error.message}`,
        'openai',
        error.status?.toString(),
        error.response?.data
      );
    }
  }
}
