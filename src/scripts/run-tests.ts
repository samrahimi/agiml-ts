// scripts/run-tests.ts
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

// Ensure required environment variables are set
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

console.log('\nRunning LLM Client Tests...\n');
console.log('Note: You will see streaming outputs from the LLM responses.\n');
console.log('Watch the outputs to verify conversation coherence and AGIML formatting.\n');

const testProcess = spawn('vitest', ['run', 'tests/basic.test.ts'], {
  stdio: 'inherit',
  shell: true
});

testProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`\nTests failed with code ${code}`);
    process.exit(code || 1);
  }
  console.log('\nTests completed successfully!\n');
});
