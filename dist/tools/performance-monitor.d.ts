import { Tool, ToolResult, PerformanceMonitorArgs } from '../types/tools.js';
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
                metrics: {
                    type: string;
                    items: {
                        type: string;
                        enum: string[];
                    };
                    default: string[];
                    description: string;
                };
                interval: {
                    type: string;
                    default: number;
                    description: string;
                };
            };
            required: string[];
        };
    };
    execute(args: PerformanceMonitorArgs): Promise<ToolResult>;
    private collectMetrics;
    private findProcessId;
    private simulateFPS;
    private analyzePerformance;
    private generatePerformanceRecommendations;
    private average;
    private detectSpikes;
    private detectDrops;
    private calculateTrend;
}
//# sourceMappingURL=performance-monitor.d.ts.map