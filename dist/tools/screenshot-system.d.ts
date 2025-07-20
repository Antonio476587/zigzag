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
                window_title: {
                    type: string;
                    description: string;
                };
                region: {
                    type: string;
                    properties: {
                        x: {
                            type: string;
                        };
                        y: {
                            type: string;
                        };
                        width: {
                            type: string;
                        };
                        height: {
                            type: string;
                        };
                    };
                    description: string;
                };
                output_path: {
                    type: string;
                    description: string;
                };
                format: {
                    type: string;
                    enum: string[];
                    default: string;
                };
            };
            required: string[];
        };
    };
    execute(args: any): Promise<ToolResult>;
    private captureScreen;
    private captureWindow;
    private captureRegion;
}
//# sourceMappingURL=screenshot-system.d.ts.map