// clientFactory.ts
import { ModelVendor, AgentConfig, AgentError } from './types';
import { LLMClient } from './interfaces';
import { OpenAIClient } from './clients/openaiClient';
import { CustomClient } from './clients/customClient';
// Import other client implementations...

export class LLMClientFactory {
  private static instances = new Map<string, LLMClient>();

  static async createClient(config: AgentConfig): Promise<LLMClient> {
    const clientKey = `${config.model_vendor}-${config.model_id}`;
    
    if (this.instances.has(clientKey)) {
      return this.instances.get(clientKey)!;
    }

    const client = await this.initializeNewClient(config);
    this.instances.set(clientKey, client);
    return client;
  }

  private static async initializeNewClient(config: AgentConfig): Promise<LLMClient> {
    let client: LLMClient;

    switch (config.model_vendor) {
      case 'openai':
      case 'perplexity':
      case 'mistral_openai':
        client = new OpenAIClient();
        break;

      case 'custom':
        client = new CustomClient();
        break;

      // Add other vendor cases...

      default:
        throw new AgentError(
          `Unsupported model vendor: ${config.model_vendor}`,
          config.model_vendor
        );
    }

    await client.initialize(config);
    return client;
  }
}
