import { Tool, ToolResult, ScreenshotArgs } from '../types/tools.js';
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
                format: {
                    type: string;
                    enum: string[];
                    default: string;
                };
                quality: {
                    type: string;
                    minimum: number;
                    maximum: number;
                    default: number;
                };
            };
            required: string[];
        };
    };
    execute(args: ScreenshotArgs): Promise<ToolResult>;
    private captureScreen;
    private captureWindow;
    private captureRegion;
    private processImage;
}
//# sourceMappingURL=screenshot.d.ts.map