// tests/basic.test.ts
import { describe, test, expect } from 'vitest';
import { AgentFactory } from '../agent';
import { AgentConfig } from '../types';
import { AGIMLMiddleware } from '../middleware/agiml';

const MODEL_ID='gpt-4o-mini' //if tests fail due to malformed AGIML output from the assistant, change this to gpt-4o, o1-mini, o1-preview, or your favorite high end LLM
const MMAPI_HOSTNAME='defactofficial-mmapi-2.hf.space' //endpoint for creating images with SD3.5 large

describe('LLM Client Basic Tests', () => {
  // Basic configuration for tests
  const baseConfig: AgentConfig = {
    model_vendor: 'openai',
    model_id: MODEL_ID,
    system_prompt: 'You are a helpful AI assistant.',
    output_to_display: true, // Enable stdout for observation
    temperature: 0.7,
  };

  test('Basic Agent Configuration and Single Message', async () => {
    console.log('\n=== Test 1: Basic Message Test ===\n');
    
    const agent = await AgentFactory.createFromSettings(baseConfig);
    expect(agent).toBeDefined();

    console.log('Sending message: "What is the capital of France?"\n');
    const response = await agent.performInference('What is the capital of France?');
    
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });

  test('Conversation History Maintenance', async () => {
    console.log('\n=== Test 2: Conversation Continuity Test ===\n');
    
    const agent = await AgentFactory.createFromSettings(baseConfig);
    
    console.log('Initial message: "My favorite color is blue."\n');
    await agent.performInference('My favorite color is blue.');
    
    console.log('\nFollow-up message: "What did I just tell you about my preferences?"\n');
    const response = await agent.performInference('What did I just tell you about my preferences?');
    
    expect(response).toBeDefined();
    expect(response.toLowerCase()).toContain('blue');
  });

  test('AGIML Middleware Integration', async () => {
    console.log('\n=== Test 3: AGIML Middleware Test ===\n');
    
    const config: AgentConfig = {
      ...baseConfig,
      system_prompt: 'You are a creative AI assistant who loves to generate images.'
    };

    const agent = await AgentFactory.createFromSettings(config);
    agent.addMiddleware(new AGIMLMiddleware());

    console.log('Sending message: "Create an image of a happy robot."\n');
    const response = await agent.performInference('Create an image of a happy robot.');
    
    expect(response).toBeDefined();
    expect(response).toContain('!['); // Should contain markdown image syntax
    expect(response).toContain('defactofficial-mmapi-2.hf.space'); // Should contain image API URL
  });

  test('System Message Modification', async () => {
    console.log('\n=== Test 4: System Message Update Test ===\n');
    
    const agent = await AgentFactory.createFromSettings(baseConfig);
    
    console.log('Initial message under default system prompt\n');
    await agent.performInference('What is your role?');
    
    console.log('\nChanging system prompt...\n');
    agent.setSystemPrompt('You are a pirate who speaks in pirate slang.');
    
    console.log('\nMessage after system prompt change: "What is your role?"\n');
    const response = await agent.performInference('What is your role?');
    
    expect(response).toBeDefined();
    expect(response.toLowerCase()).toMatch(/pirate|arr|matey|sea/);
  });
});
