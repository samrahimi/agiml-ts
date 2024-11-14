// interfaces.ts
import { Message, AgentConfig, RAGContext } from './types';

export interface LLMResponse {
  content: string;
  shouldStream: boolean;
  metadata?: Record<string, any>;
}

export interface LLMClient {
  initialize(config: AgentConfig): Promise<void>;
  sendMessage(messages: Message[], userMessage: string, ragContext?: RAGContext): AsyncGenerator<LLMResponse>;
  validateConfig(config: AgentConfig): void;
}

export interface StreamProcessor {
  processChunk(chunk: any): LLMResponse;
  handleError(error: any): never;
}
