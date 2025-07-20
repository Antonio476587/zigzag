import { Tool, ToolResult } from '../types/tools.js';
export declare class FileWatcherTool implements Tool {
    private watchers;
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
                path: {
                    type: string;
                    description: string;
                };
                pattern: {
                    type: string;
                    description: string;
                };
                events: {
                    type: string;
                    items: {
                        type: string;
                        enum: string[];
                    };
                    default: string[];
                    description: string;
                };
                watch_id: {
                    type: string;
                    description: string;
                };
                duration: {
                    type: string;
                    description: string;
                    default: number;
                };
            };
            required: string[];
        };
    };
    execute(args: any): Promise<ToolResult>;
    private startWatching;
    private stopWatching;
    private getStatus;
}
//# sourceMappingURL=file-watcher.d.ts.map