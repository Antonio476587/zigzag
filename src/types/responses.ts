export interface ScreenshotResponse {
  imageData: string;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
  timestamp: string;
}

export interface UIElement {
  id: string;
  type: string;
  text?: string;
  label?: string;
  altText?: string;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  style?: Record<string, any>;
  children?: UIElement[];
  properties?: Record<string, any>;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  background?: string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  elevation?: number;
  hasAnimation?: boolean;
  material?: string;
}

export interface UIInspectResponse {
  hierarchy: UIElement;
  analysis: {
    accessibility_issues: AccessibilityIssue[];
    design_patterns: string[];
    performance_concerns: any[];
    compliance: any;
  };
  metadata: {
    timestamp: string;
    target: string;
    element_count: number;
  };
}

export interface AccessibilityIssue {
  type: string;
  element: string;
  severity: 'high' | 'medium' | 'low';
  description?: string;
}

export interface DesignAuditResponse {
  summary: Record<string, any>;
  detailed_results: Record<string, GuidelineResult>;
  recommendations: Recommendation[];
  compliance_score: {
    overall: number;
    by_guideline: Record<string, number>;
    grade: string;
  };
}

export interface GuidelineResult {
  guideline: string;
  issues: DesignIssue[];
  checks_performed: number;
  compliance_areas: string[];
}

export interface DesignIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  affected_elements: string[];
}

export interface Recommendation {
  guideline: string;
  issue: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  estimated_effort: string;
}

export interface PerformanceMetrics {
  timestamp: string[];
  cpu: CPUMetric[];
  memory: MemoryMetric[];
  gpu: GPUMetric[];
  network: NetworkMetric[];
  disk: DiskMetric[];
  fps: number[];
}

export interface CPUMetric {
  usage: number;
  user: number;
  system: number;
}

export interface MemoryMetric {
  used: number;
  free: number;
  usage_percent: number;
}

export interface GPUMetric {
  utilization: number;
  memory_used: number;
}

export interface NetworkMetric {
  rx_bytes: number;
  tx_bytes: number;
}

export interface DiskMetric {
  read_bytes: number;
  write_bytes: number;
}

export interface PerformanceAnalysis {
  summary: {
    cpu?: {
      average: number;
      peak: number;
      status: 'normal' | 'warning' | 'critical';
    };
    memory?: {
      average: number;
      peak: number;
      status: 'normal' | 'warning' | 'critical';
    };
    fps?: {
      average: number;
      minimum: number;
      status: 'excellent' | 'warning' | 'critical';
    };
  };
  trends: Record<string, any>;
  alerts: PerformanceAlert[];
  bottlenecks: any[];
}

export interface PerformanceAlert {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
}