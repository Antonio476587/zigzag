import { Tool, ToolResult } from '../types/tools.js';
export declare class PerformanceMonitorTool implements Tool {
    definition: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                target: {
                    type: string;
                    description: string;
                };
                duration: {
                    type: string;
                    default: number;
                    description: string;
                };
            };
            required: string[];
        };
    };
    execute(_args: {
        target: string;
        duration?: number;
    }): Promise<ToolResult>;
}
//# sourceMappingURL=performance-monitor-simple.d.ts.map