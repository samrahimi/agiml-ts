// types.ts
export type ModelVendor = 
  | 'openai' 
  | 'anthropic' 
  | 'google' 
  | 'cohere' 
  | 'perplexity' 
  | 'mistral_openai' 
  | 'openrouter'
  | 'custom';

export type ResponseFormat = 'text' | 'json_object';

export type MessageRole = 'system' | 'user' | 'assistant' | 'function';

export type CitationQuality = 'fast' | 'accurate';

export interface CustomVendorOptions {
  /** Custom API endpoint for the chat completions API */
  custom_api_endpoint: string;
  /** API key for authentication */
  custom_api_key: string;
}

export interface ToolOptions {
  /** Enable web search capability */
  web?: boolean;
  /** Limit search to specific domain */
  search_domain?: string;
  /** Citation quality setting for search results */
  citationQuality?: CitationQuality;
  /** Use previously cached documents */
  use_cached_documents?: boolean;
  /** Cache documents for future use */
  cache_documents?: boolean;
  /** Text to display before citations */
  citationsHeaderText?: string;
  /** Placeholder text while citations are loading */
  citationsPlaceholderText?: string;
  /** Whether to append citations to the markdown stream */
  appendCitationsToMarkdownStream?: boolean;
  /** Custom vendor configuration - only used when model_vendor is 'custom' */
  custom_vendor?: CustomVendorOptions;
}

export interface Message {
  role: MessageRole;
  content: string;
}

export interface Document {
  title: string;
  url: string;
  snippet?: string;
}

export interface CitationResponse {
  documents: Document[];
  [key: string]: any;
}

export interface RAGContext {
  __documents__?: Document[];
  [key: string]: any;
}

export interface AgentConfig {
  /** The AI vendor to use (e.g., 'openai', 'anthropic', etc.) */
  model_vendor: ModelVendor;
  /** The specific model ID from the vendor */
  model_id: string;
  /** System prompt to initialize the conversation */
  system_prompt: string;
  /** Optional unique identifier for the agent */
  agent_id?: string;
  /** Maximum tokens in the response */
  max_tokens?: number;
  /** Temperature for response randomness (0-1) */
  temperature?: number;
  /** Format of the response */
  response_format?: ResponseFormat;
  /** Configuration for additional tools */
  tool_options?: ToolOptions;
  /** Whether to display output to console */
  output_to_display?: boolean;
  /** Override JSON stdout formatting */
  json_stdout_override?: boolean;
  /** Enable debug logging */
  DEBUG?: boolean;
}

export interface VendorSpecificOptions {
  openai: {
    response_format: { type: ResponseFormat };
    max_tokens: number;
    stream: boolean;
    temperature: number;
  };
  anthropic: {
    max_tokens: number;
    temperature: number;
  };
  google: {
    temperature: number;
    maxOutputTokens: number;
    responseMimeType: 'application/json' | 'text/plain';
  };
  cohere: {
    model: string;
    preamble: string;
    message: string;
    chatHistory: Message[];
    temperature: number;
    max_tokens?: number;
    connectors?: Array<{
      id: string;
      continueOnFailure: boolean;
      options?: Record<string, any>;
    }>;
    citationQuality?: CitationQuality;
    documents?: Document[];
  };
}

export interface StreamChunk {
  eventType?: string;
  text?: string;
  delta?: {
    text?: string;
  };
  choices?: Array<{
    delta: {
      content?: string;
    };
  }>;
  response?: CitationResponse;
}

export class AgentError extends Error {
  constructor(
    message: string,
    public readonly vendor: ModelVendor,
    public readonly errorCode?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export interface IAgent {
  performInference(userMessage: string, RAGContext?: RAGContext): Promise<string>;
  rejiggerConfig(newConfig: AgentConfig): void;
  setSystemPrompt(newPrompt: string): void;
}

export interface AgentFactoryInterface {
  createFromSettings(agentSettings: AgentConfig, forceOverwrite?: boolean): IAgent;
  loadSession(agent_id: string): IAgent | null;
}
