import { Tool, ToolResult } from '../types/tools.js';

export class ScreenshotTool implements Tool {
  definition = {
    name: 'screenshot',
    description: 'Capture screenshots (simplified version)',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          enum: ['screen'],
          description: 'What to capture'
        }
      },
      required: ['target']
    }
  };

  async execute(): Promise<ToolResult> {
    return {
      content: [{
        type: 'text',
        text: 'Screenshot functionality requires platform-specific dependencies. Please install with: npm install screenshot-desktop sharp'
      }],
      isError: false
    };
  }
}