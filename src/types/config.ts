export interface ServerConfig {
  name: string;
  version: string;
  capabilities: {
    tools: Record<string, any>;
  };
}

export interface ToolConfig {
  [key: string]: any;
}

export interface FluentColors {
  primary: string[];
  neutral: string[];
  accent: string[];
}

export interface FluentTypography {
  caption: { size: number; weight: number };
  body: { size: number; weight: number };
  subtitle: { size: number; weight: number };
  title: { size: number; weight: number };
  'large-title': { size: number; weight: number };
}

export interface DesignGuidelines {
  fluent_spacing: number[];
  fluent_colors: FluentColors;
  fluent_typography: FluentTypography;
  material_elevation: number[];
  apple_spacing: number[];
}