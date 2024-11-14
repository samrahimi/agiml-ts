// config.ts
export const DEFAULT_MAX_TOKENS = 4096;
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_CITATION_QUALITY = 'fast' as const;

export const VENDOR_ENDPOINTS = {
  PERPLEXITY: 'https://api.perplexity.ai',
  MISTRAL: 'https://api.mistral.ai/v1',
  OPENROUTER: 'https://openrouter.ai/api/v1',
} as const;

export const ROLE_MAPPINGS = {
  google: {
    user: 'user',
    assistant: 'model',
    system: 'user',
    function: 'function'
  },
  cohere: {
    user: 'USER',
    assistant: 'CHATBOT',
    system: 'SYSTEM',
    function: 'CHATBOT'
  }
} as const;

export const SAFETY_SETTINGS = {
  google: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE'
    }
  ]
} as const;

export interface EnvironmentConfig {
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_AI_API_KEY: string;
  PERPLEXITY_API_KEY: string;
  MISTRAL_API_KEY: string;
  OPENROUTER_API_KEY: string;
  COHERE_API_KEY: string;
  MESSAGE_DELIMITER?: string;
  ENABLE_COHERE_CHAT_HISTORY?: boolean;
}

// config.ts
export const DEFAULT_MAX_TOKENS = 4096;
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_CITATION_QUALITY = 'fast' as const;

export const VENDOR_ENDPOINTS = {
  PERPLEXITY: 'https://api.perplexity.ai',
  MISTRAL: 'https://api.mistral.ai/v1',
  OPENROUTER: 'https://openrouter.ai/api/v1',
} as const;

export const ROLE_MAPPINGS = {
  google: {
    user: 'user',
    assistant: 'model',
    system: 'user',
    function: 'function'
  },
  cohere: {
    user: 'USER',
    assistant: 'CHATBOT',
    system: 'SYSTEM',
    function: 'CHATBOT'
  }
} as const;

export const SAFETY_SETTINGS = {
  google: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE'
    }
  ]
} as const;

export interface EnvironmentConfig {
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_AI_API_KEY: string;
  PERPLEXITY_API_KEY: string;
  MISTRAL_API_KEY: string;
  OPENROUTER_API_KEY: string;
  COHERE_API_KEY: string;
  MESSAGE_DELIMITER?: string;
  ENABLE_COHERE_CHAT_HISTORY?: boolean;
}

export const validateEnvironment = (): EnvironmentConfig => {
  const requiredVars = [
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'GOOGLE_AI_API_KEY',
    'PERPLEXITY_API_KEY',
    'MISTRAL_API_KEY',
    'OPENROUTER_API_KEY',
    'COHERE_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY!,
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY!,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY!,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY!,
    COHERE_API_KEY: process.env.COHERE_API_KEY!,
    MESSAGE_DELIMITER: process.env.MESSAGE_DELIMITER,
    ENABLE_COHERE_CHAT_HISTORY: process.env.ENABLE_COHERE_CHAT_HISTORY === 'true'
  };
};
export const validateEnvironment = (): EnvironmentConfig => {
  const requiredVars = [
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'GOOGLE_AI_API_KEY',
    'PERPLEXITY_API_KEY',
    'MISTRAL_API_KEY',
    'OPENROUTER_API_KEY',
    'COHERE_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY!,
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY!,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY!,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY!,
    COHERE_API_KEY: process.env.COHERE_API_KEY!,
    MESSAGE_DELIMITER: process.env.MESSAGE_DELIMITER,
    ENABLE_COHERE_CHAT_HISTORY: process.env.ENABLE_COHERE_CHAT_HISTORY === 'true'
  };
};
