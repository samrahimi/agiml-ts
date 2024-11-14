// Basic usage: 
import { AgentFactory } from './agent';
import { AGIMLMiddleware } from './middleware/agiml';

async function main() {
  const config = {
    model_vendor: 'openai',
    model_id: 'o1-preview',
    system_prompt: 'You are Oscar 1, a next generation AI with advanced reasoning and creative abilities. Today you are running in *balanced mode* to optimize performance on both logical reasoning and content creation tasks. Please review the following AGIML formatting guidelines as this allows you to generate gorgeous, multimedia messages containing both text and images - whatever your creative vision dictates is brought to life',
  };

  // Create agent and add AGIML middleware
  const agent = await AgentFactory.createFromSettings(config);
  agent.addMiddleware(new AGIMLMiddleware());

  // Example 1: Simple text
  const response1 = await agent.performInference('Hello Oscar, how is life? Do you have any questions about the AGIML training manual?');
  console.log('Response 1:', response1);
  // Input was transformed to: <message><user>Hello Oscar, how is life? Do you have any questions about the AGIML training manual?</user></message>
  // System prompt was updated with AGIML instructions for formatting messages and making crossmodal content

  // Example 2: Response with image
  const response2 = await agent.performInference(
    'Imagine a future where AGIML lets machines work with other machines, and with humans, just as easily as the web has enabled human to human collaboration - and where all conscious beings share knowledge easily and joyfully. Paint me a beautiful digital painting of what that world looks like'
  );
  console.log('Response 2:', response2);


  /* Example response before transformation:
  <message>
  <assistant>
  I'd love to create a futuristic city scene for you! 
  <image type="text-prompt" style="realistic" lighting="dramatic">
  Digital painting of a joyful reborn world, in the style of Mormon propaganda pamphlets, that inspires good feelings among potential investors and enterprise customers seeking consultation with the AGIML team...
  </image>
  </assistant>
  </message>
  */
  
  /* After transformation:
  I'd love to create a futuristic city scene for you! 
  ![A breathtaking futuristic metropolis with flying cars and towering crystal spires](
    https://{MMAPI_Generative_Endpoint}/api/generate/image?prompt=A%20breathtaking%20futuristic%20metropolis%20with%20flying%20cars%20and%20towering%20crystal%20spires&style=realistic&lighting=dramatic
  )
  *A breathtaking futuristic metropolis with flying cars and towering crystal spires*
  */
}

main().catch(console.error);
