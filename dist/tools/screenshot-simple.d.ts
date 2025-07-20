import { Tool, ToolResult } from '../types/tools.js';
export declare class ScreenshotTool implements Tool {
    definition: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                target: {
                    type: string;
                    enum: string[];
                    description: string;
                };
            };
            required: string[];
        };
    };
    execute(): Promise<ToolResult>;
}
//# sourceMappingURL=screenshot-simple.d.ts.map