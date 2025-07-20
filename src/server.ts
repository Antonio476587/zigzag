import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { ScreenshotTool } from './tools/screenshot-system.js';
import { UIInspectTool } from './tools/ui-inspect-simple.js';
import { PerformanceMonitorTool } from './tools/performance-monitor-simple.js';
import { FileWatcherTool } from './tools/file-watcher.js';
import { Tool } from './types/tools.js';

export class AIAgentToolboxServer {
  private server: Server;
  private tools: Map<string, Tool>;

  constructor() {
    this.server = new Server(
      { 
        name: 'ai-agent-toolbox', 
        version: '1.0.0' 
      },
      { 
        capabilities: { 
          tools: {} 
        } 
      }
    );

    this.tools = new Map<string, Tool>([
      ['screenshot', new ScreenshotTool()],
      ['ui_inspect', new UIInspectTool()],
      ['performance_monitor', new PerformanceMonitorTool()],
      ['file_watcher', new FileWatcherTool()]
    ]);

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Array.from(this.tools.values()).map(tool => tool.definition)
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.get(request.params.name);
      if (!tool) {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }
      
      try {
        const result = await tool.execute(request.params.arguments || {});
        return {
          content: result.content,
          isError: result.isError
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${request.params.name}: ${errorMessage}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}