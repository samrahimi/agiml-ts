// agent.ts
import { v4 as uuidv4 } from 'uuid';
import { AgentConfig, Message, RAGContext, IAgent } from './types';
import { LLMClient } from './interfaces';
import { LLMClientFactory } from './clientFactory';

const AGENT_SESSIONS: Record<string, Agent> = {};

export class Agent implements IAgent {
  private config: AgentConfig;
  private messages: Message[];
  private agent_id: string;
  private client: LLMClient;
  private middlewareManager: MiddlewareManager;

  private constructor(config: AgentConfig, client: LLMClient) {
    this.config = config;
    this.client = client;
    this.messages = [{ role: 'system', content: this.config.system_prompt }];
    this.agent_id = config.agent_id || uuidv4();
    this.middlewareManager = new MiddlewareManager();
    AGENT_SESSIONS[this.agent_id] = this;
  }

  static async create(config: AgentConfig): Promise<Agent> {
    const client = await LLMClientFactory.createClient(config);
    return new Agent(config, client);
  }

  static loadSession(agent_id: string): Agent | null {
    return AGENT_SESSIONS[agent_id] || null;
  }

  async rejiggerConfig(newConfig: AgentConfig): Promise<void> {
    if (this.config.model_vendor !== newConfig.model_vendor || 
        this.config.model_id !== newConfig.model_id) {
      this.client = await LLMClientFactory.createClient(newConfig);
    }
    this.config = newConfig;
    const systemMessage = this.messages.find(x => x.role === 'system');
    if (systemMessage) {
      systemMessage.content = this.config.system_prompt;
    }
  }

  setSystemPrompt(newPrompt: string): void {
    const systemMessage = this.messages.find(x => x.role === 'system');
    if (systemMessage) {
      systemMessage.content = newPrompt;
    }
  }

  addMiddleware(middleware: Middleware): void {
    this.middlewareManager.addMiddleware(middleware);
  }

  removeMiddleware(name: string): void {
    this.middlewareManager.removeMiddleware(name);
  }

  async performInference(userMessage: string, RAGContext?: RAGContext): Promise<string> {
    // Create initial context
    let context: MiddlewareContext = {
      messages: [...this.messages],
      userMessage,
      metadata: { RAGContext }
    };

    // Run before middleware
    context = await this.middlewareManager.runBeforeMiddleware(context);
    
    // Update messages with potentially modified content
    this.messages = context.messages;
    this.messages.push({ role: 'user', content: context.userMessage });

    if (this.config.DEBUG) {
      console.log(JSON.stringify(this.messages, null, 2));
    }

    let fullResponse = '';

    for await (const response of this.client.sendMessage(this.messages, userMessage, RAGContext)) {
      if (response.shouldStream &&
          this.config.output_to_display &&
          (this.config.json_stdout_override || this.config?.response_format !== 'json_object')) {
        process.stdout.write(response.content);
      }
      
      fullResponse += response.content;
    }

    if (!this.config.json_stdout_override) {
      process.stdout.write(process.env.MESSAGE_DELIMITER || '\n\n   \n\n   \n\n');
    }

    // Run after middleware
    context = await this.middlewareManager.runAfterMiddleware({
      ...context,
      response: fullResponse
    });

    const finalResponse = context.response || fullResponse;
    this.messages.push({ role: 'assistant', content: finalResponse });
    return finalResponse;
  }
}

export const AgentFactory = {
  createFromSettings: async (
    agentSettings: AgentConfig, 
    forceOverwrite?: boolean
  ): Promise<Agent> => {
    if (agentSettings.agent_id && !forceOverwrite) {
      const existingAgent = Agent.loadSession(agentSettings.agent_id);
      if (existingAgent) {
        await existingAgent.rejiggerConfig(agentSettings);
        return existingAgent;
      }
    }
    return await Agent.create(agentSettings);
  },
  loadSession: Agent.loadSession
};
