// middleware/types.ts
import { Message } from '../types';

export interface MiddlewareContext {
  messages: Message[];
  userMessage: string;
  response?: string;
  metadata?: Record<string, any>;
}

export interface Middleware {
  name: string;
  beforeRequest?: (context: MiddlewareContext) => Promise<MiddlewareContext>;
  afterResponse?: (context: MiddlewareContext) => Promise<MiddlewareContext>;
}
