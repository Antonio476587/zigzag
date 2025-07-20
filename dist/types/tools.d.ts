export interface Tool {
    definition: ToolDefinition;
    execute(args: any): Promise<ToolResult>;
}
export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
    };
}
export interface ToolResult {
    content: ContentItem[];
    isError: boolean;
}
export interface ContentItem {
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
    uri?: string;
}
export interface ScreenshotArgs {
    target: 'screen' | 'window' | 'region';
    window_title?: string;
    region?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    format?: 'png' | 'jpg' | 'webp';
    quality?: number;
}
export interface UIInspectArgs {
    target: string;
    element_path?: string;
    include_properties?: string[];
    depth?: number;
}
export interface DesignAuditArgs {
    guidelines: ('microsoft_fluent' | 'apple_hig' | 'material_design' | 'accessibility')[];
    target_type: 'screenshot' | 'application' | 'url';
    target: string;
    focus_areas?: ('color' | 'typography' | 'spacing' | 'navigation' | 'interaction' | 'accessibility')[];
    severity_filter?: 'all' | 'high' | 'medium' | 'low';
}
export interface PerformanceMonitorArgs {
    target: string;
    duration?: number;
    metrics?: ('cpu' | 'memory' | 'gpu' | 'network' | 'disk' | 'fps')[];
    interval?: number;
}
//# sourceMappingURL=tools.d.ts.map