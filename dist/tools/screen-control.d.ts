import { Tool, ToolResult } from '../types/tools.js';
export declare class ScreenControlTool implements Tool {
    definition: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                action: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                x: {
                    type: string;
                    description: string;
                };
                y: {
                    type: string;
                    description: string;
                };
                text: {
                    type: string;
                    description: string;
                };
                key: {
                    type: string;
                    description: string;
                };
                scroll_direction: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                scroll_amount: {
                    type: string;
                    default: number;
                    description: string;
                };
                end_x: {
                    type: string;
                    description: string;
                };
                end_y: {
                    type: string;
                    description: string;
                };
                button: {
                    type: string;
                    enum: string[];
                    default: string;
                    description: string;
                };
                delay: {
                    type: string;
                    default: number;
                    description: string;
                };
            };
            required: string[];
        };
    };
    execute(args: any): Promise<ToolResult>;
    private performClick;
    private performDoubleClick;
    private performType;
    private performKey;
    private performScroll;
    private performDrag;
    private performMouseMove;
    private getLinuxButton;
    private convertToLinuxKey;
    private convertToMacKey;
    private convertToWindowsKey;
}
//# sourceMappingURL=screen-control.d.ts.map