// middleware/agiml.ts
import { Middleware, MiddlewareContext } from './types';

const AGIML_INSTRUCTION = `
You are communicating using AGIML, a declarative hypermedia language. Your responses should:
1. Always be wrapped in <message><assistant>...</assistant></message> tags
2. You can include media generation requests using tags like <image>
3. Keep your image prompts concise and clear, without newlines
4. Attributes in tags should be space-separated key="value" pairs
`.trim();

interface ImageAttributes {
  [key: string]: string;
}

export class AGIMLMiddleware implements Middleware {
  name = 'agiml';

  async beforeRequest(context: MiddlewareContext): Promise<MiddlewareContext> {
    // Wrap user message in AGIML envelope
    const wrappedMessage = `<message><user>${context.userMessage}</user></message>`;

    // Find and update system message, or create new one
    const systemMessageIndex = context.messages.findIndex(m => m.role === 'system');
    if (systemMessageIndex >= 0) {
      context.messages[systemMessageIndex].content = 
        `${context.messages[systemMessageIndex].content}\n\n${AGIML_INSTRUCTION}`;
    } else {
      context.messages.unshift({
        role: 'system',
        content: AGIML_INSTRUCTION
      });
    }

    return {
      ...context,
      userMessage: wrappedMessage,
      metadata: { ...context.metadata, format: 'agiml' }
    };
  }

  async afterResponse(context: MiddlewareContext): Promise<MiddlewareContext> {
    if (!context.response) return context;

    const transformedResponse = this.processAGIMLResponse(context.response);

    return {
      ...context,
      response: transformedResponse
    };
  }

  private processAGIMLResponse(response: string): string {
    // Remove AGIML envelope if present
    response = response.replace(/<message>\s*<assistant>(.*?)<\/assistant>\s*<\/message>/s, '$1');

    // Process image tags
    return response.replace(/<image(.*?)>(.*?)<\/image>/g, (match, attributes, content) => {
      const parsedAttrs = this.parseAttributes(attributes);
      const processedPrompt = this.processPrompt(content);
      return this.generateMarkdownImage(processedPrompt, parsedAttrs);
    });
  }

  private parseAttributes(attributeString: string): ImageAttributes {
    const attrs: ImageAttributes = {};
    const matches = attributeString.match(/(\w+)="([^"]*?)"/g) || [];
    
    matches.forEach(match => {
      const [key, value] = match.split('=').map(s => s.replace(/"/g, ''));
      attrs[key.trim()] = value;
    });

    return attrs;
  }

  private processPrompt(prompt: string): string {
    return prompt
      .trim()
      // Replace newlines with spaces
      .replace(/\n/g, ' ')
      // Remove all characters except alphanumeric and specified special chars
      .replace(/[^a-zA-Z0-9.,!()[\] ]/g, '')
      // Normalize spaces
      .replace(/\s+/g, ' ')
      // Encode for URL
      .split(' ')
      .map(encodeURIComponent)
      .join('%20');
  }

  private generateMarkdownImage(prompt: string, attrs: ImageAttributes): string {
    // Start building the URL with the base and prompt
    let url = `https://defactofficial-mmapi-2.hf.space/api/generate/image?prompt=${prompt}`;
    
    // Add any additional attributes as query parameters
    for (const [key, value] of Object.entries(attrs)) {
      if (key !== 'type') { // Skip the type attribute as it's not needed in the URL
        url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    }
    
    // Return markdown image with prompt as alt text and caption
    return `![${prompt}](${url})\n*${decodeURIComponent(prompt)}*`;
  }
}
