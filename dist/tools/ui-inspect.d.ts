import { Tool, ToolResult, UIInspectArgs } from '../types/tools.js';
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
                element_path: {
                    type: string;
                    description: string;
                };
                include_properties: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                depth: {
                    type: string;
                    default: number;
                    description: string;
                };
            };
            required: string[];
        };
    };
    execute(args: UIInspectArgs): Promise<ToolResult>;
    private extractUIHierarchy;
    private extractMacOSUIHierarchy;
    private extractWindowsUIHierarchy;
    private extractLinuxUIHierarchy;
    private createMockHierarchy;
    private analyzeUIElements;
    private checkAccessibility;
    private identifyDesignPatterns;
    private analyzePerformance;
    private checkCompliance;
    private countElements;
    private traverseElements;
    private hasNavigationDrawer;
    private hasTabBar;
    private hasCardLayout;
    private hasGridLayout;
    private hasToolbar;
    private hasModal;
    private calculateColorContrast;
}
//# sourceMappingURL=ui-inspect.d.ts.map