// baseClient.ts
import { AgentConfig, Message, RAGContext, AgentError } from './types';
import { LLMClient, LLMResponse } from './interfaces';

export abstract class BaseLLMClient implements LLMClient {
  protected config!: AgentConfig;

  async initialize(config: AgentConfig): Promise<void> {
    this.validateConfig(config);
    this.config = config;
    await this.initializeClient();
  }

  protected abstract initializeClient(): Promise<void>;
  
  abstract sendMessage(
    messages: Message[], 
    userMessage: string, 
    ragContext?: RAGContext
  ): AsyncGenerator<LLMResponse>;

  validateConfig(config: AgentConfig): void {
    // Common config validation
    if (!config.model_id) {
      throw new AgentError('Model ID is required', config.model_vendor);
    }
    
    // Call vendor-specific validation
    this.vendorSpecificValidation(config);
  }

  protected abstract vendorSpecificValidation(config: AgentConfig): void;

  protected getDefaultParams() {
    return {
      max_tokens: this.config.max_tokens || 4096,
      temperature: this.config.temperature || 0.7,
      response_format: { type: this.config.response_format || 'text' }
    };
  }
}
