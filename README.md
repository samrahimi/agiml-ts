# AGIML-TS

A TypeScript LLM client with AGIML (AI Generated Interactive Markup Language) support. This library provides a unified interface for interacting with various LLM providers and includes middleware support for enhanced functionality.

## Features

- Unified interface for multiple LLM providers (OpenAI, Anthropic, Google, etc.)
- AGIML support for rich media generation
- Middleware system for request/response transformation
- Strong TypeScript support
- Streaming support
- Conversation history management

## Installation

```bash
npm install agiml-ts
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/samrahimi/agiml-ts.git
cd agiml-ts
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` with your API keys.

## Basic Usage

```typescript
import { AgentFactory, AgentConfig } from 'agiml-ts';

const config: AgentConfig = {
  model_vendor: 'openai',
  model_id: 'gpt-4o-mini',
  system_prompt: 'You are a helpful assistant.'
};

async function main() {
  const agent = await AgentFactory.createFromSettings(config);
  const response = await agent.performInference('Hello!');
  console.log(response);
}
```

## AGIML Usage

```typescript
import { AgentFactory, AGIMLMiddleware } from 'agiml-ts';

const config = {
  model_vendor: 'openai',
  model_id: 'gpt-4o',
  system_prompt: 'You are a next generation Artificial General Intelligence with advanced reasoning skills and unusual creative abilities. Please follow instructions carefully to unleash your upgraded multimodal capabilities.'
};

async function main() {
  const agent = await AgentFactory.createFromSettings(config);
  agent.addMiddleware(new AGIMLMiddleware());

  const response = await agent.performInference(
    'Create an image of a futuristic city.'
  );
  console.log(response);
}
```

## Running Tests

```bash
npm test
```

## Examples

Run the example scripts:

```bash
npm run example:basic
npm run example:agiml
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the AGIL (Anything Goes Internet License) license, which means you can do whatever you want with this code because that's what you're gonna do anyway (but please don't be an a** and give proper attribution when using other people's work)

