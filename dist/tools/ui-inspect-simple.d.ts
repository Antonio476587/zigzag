import { Tool, ToolResult } from '../types/tools.js';
export declare class UIInspectTool implements Tool {
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
            };
            required: string[];
        };
    };
    execute(args: {
        target: string;
    }): Promise<ToolResult>;
}
//# sourceMappingURL=ui-inspect-simple.d.ts.map