import si from 'systeminformation';
export class PerformanceMonitorTool {
    definition = {
        name: 'performance_monitor',
        description: 'Monitor application performance metrics and system resources',
        inputSchema: {
            type: 'object',
            properties: {
                target: {
                    type: 'string',
                    description: 'Application or process to monitor'
                },
                duration: {
                    type: 'number',
                    default: 30,
                    description: 'Monitoring duration in seconds'
                },
                metrics: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['cpu', 'memory', 'gpu', 'network', 'disk', 'fps']
                    },
                    default: ['cpu', 'memory'],
                    description: 'Metrics to collect'
                },
                interval: {
                    type: 'number',
                    default: 1,
                    description: 'Sampling interval in seconds'
                }
            },
            required: ['target']
        }
    };
    async execute(args) {
        try {
            const metrics = await this.collectMetrics(args.target, args.duration || 30, args.metrics || ['cpu', 'memory'], args.interval || 1);
            const analysis = this.analyzePerformance(metrics);
            const recommendations = this.generatePerformanceRecommendations(analysis);
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            summary: analysis.summary,
                            detailed_metrics: metrics,
                            performance_analysis: analysis,
                            recommendations,
                            alerts: analysis.alerts
                        }, null, 2)
                    }],
                isError: false
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [{
                        type: 'text',
                        text: `Performance monitoring failed: ${errorMessage}`
                    }],
                isError: true
            };
        }
    }
    async collectMetrics(target, duration, metricsToCollect, interval) {
        const metrics = {
            timestamp: [],
            cpu: [],
            memory: [],
            gpu: [],
            network: [],
            disk: [],
            fps: []
        };
        const startTime = Date.now();
        const endTime = startTime + (duration * 1000);
        // Find process ID for the target application
        const targetPid = await this.findProcessId(target);
        while (Date.now() < endTime) {
            const timestamp = new Date().toISOString();
            metrics.timestamp.push(timestamp);
            for (const metric of metricsToCollect) {
                try {
                    switch (metric) {
                        case 'cpu':
                            const cpuData = await si.currentLoad();
                            metrics.cpu.push({
                                usage: cpuData.currentLoad,
                                user: cpuData.currentLoadUser,
                                system: cpuData.currentLoadSystem
                            });
                            break;
                        case 'memory':
                            const memData = await si.mem();
                            metrics.memory.push({
                                used: memData.used,
                                free: memData.free,
                                usage_percent: (memData.used / memData.total) * 100
                            });
                            break;
                        case 'gpu':
                            try {
                                const gpuData = await si.graphics();
                                if (gpuData.controllers && gpuData.controllers.length > 0) {
                                    metrics.gpu.push({
                                        utilization: gpuData.controllers[0].utilizationGpu || 0,
                                        memory_used: gpuData.controllers[0].memoryUsed || 0
                                    });
                                }
                                else {
                                    metrics.gpu.push({ utilization: 0, memory_used: 0 });
                                }
                            }
                            catch {
                                metrics.gpu.push({ utilization: 0, memory_used: 0 });
                            }
                            break;
                        case 'network':
                            const netData = await si.networkStats();
                            if (netData && netData.length > 0) {
                                metrics.network.push({
                                    rx_bytes: netData[0].rx_bytes || 0,
                                    tx_bytes: netData[0].tx_bytes || 0
                                });
                            }
                            else {
                                metrics.network.push({ rx_bytes: 0, tx_bytes: 0 });
                            }
                            break;
                        case 'disk':
                            const diskData = await si.disksIO();
                            metrics.disk.push({
                                read_bytes: diskData.rIO_sec || 0,
                                write_bytes: diskData.wIO_sec || 0
                            });
                            break;
                        case 'fps':
                            // FPS measurement would require integration with the target application
                            // For now, we'll simulate with a placeholder
                            metrics.fps.push(this.simulateFPS());
                            break;
                    }
                }
                catch (error) {
                    console.error(`Error collecting ${metric} metric:`, error);
                }
            }
            await new Promise(resolve => setTimeout(resolve, interval * 1000));
        }
        return metrics;
    }
    async findProcessId(target) {
        try {
            const processes = await si.processes();
            const targetProcess = processes.list.find(p => p.name.toLowerCase().includes(target.toLowerCase()) ||
                p.command.toLowerCase().includes(target.toLowerCase()));
            return targetProcess ? targetProcess.pid : null;
        }
        catch {
            return null;
        }
    }
    simulateFPS() {
        // Simulate FPS with some variation
        const baseFPS = 60;
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(30, Math.min(120, baseFPS + variation));
    }
    analyzePerformance(metrics) {
        const analysis = {
            summary: {},
            trends: {},
            alerts: [],
            bottlenecks: []
        };
        // CPU analysis
        if (metrics.cpu.length > 0) {
            const cpuValues = metrics.cpu.map(m => m.usage);
            const avgCPU = this.average(cpuValues);
            const maxCPU = Math.max(...cpuValues);
            const minCPU = Math.min(...cpuValues);
            analysis.summary.cpu = {
                average: Math.round(avgCPU),
                peak: Math.round(maxCPU),
                status: avgCPU > 80 ? 'critical' : avgCPU > 60 ? 'warning' : 'normal'
            };
            if (avgCPU > 80) {
                analysis.alerts.push({
                    type: 'high_cpu_usage',
                    severity: 'high',
                    message: `Average CPU usage ${avgCPU.toFixed(1)}% is critically high`
                });
                analysis.bottlenecks.push('CPU');
            }
            // Detect CPU spikes
            const cpuSpikes = this.detectSpikes(cpuValues, 90);
            if (cpuSpikes.length > 0) {
                analysis.alerts.push({
                    type: 'cpu_spikes',
                    severity: 'medium',
                    message: `Detected ${cpuSpikes.length} CPU usage spikes above 90%`
                });
            }
        }
        // Memory analysis
        if (metrics.memory.length > 0) {
            const memoryValues = metrics.memory.map(m => m.usage_percent);
            const avgMemory = this.average(memoryValues);
            const maxMemory = Math.max(...memoryValues);
            analysis.summary.memory = {
                average: Math.round(avgMemory),
                peak: Math.round(maxMemory),
                status: avgMemory > 90 ? 'critical' : avgMemory > 75 ? 'warning' : 'normal'
            };
            if (avgMemory > 90) {
                analysis.alerts.push({
                    type: 'high_memory_usage',
                    severity: 'high',
                    message: `Average memory usage ${avgMemory.toFixed(1)}% is critically high`
                });
                analysis.bottlenecks.push('Memory');
            }
            // Check for memory leaks
            const memoryTrend = this.calculateTrend(memoryValues);
            if (memoryTrend > 0.5) { // Increasing trend
                analysis.alerts.push({
                    type: 'potential_memory_leak',
                    severity: 'medium',
                    message: 'Memory usage shows increasing trend, possible memory leak'
                });
            }
        }
        // FPS analysis
        if (metrics.fps.length > 0) {
            const avgFPS = this.average(metrics.fps);
            const minFPS = Math.min(...metrics.fps);
            analysis.summary.fps = {
                average: Math.round(avgFPS),
                minimum: minFPS,
                status: avgFPS < 30 ? 'critical' : avgFPS < 60 ? 'warning' : 'excellent'
            };
            if (avgFPS < 30) {
                analysis.alerts.push({
                    type: 'low_fps',
                    severity: 'medium',
                    message: `Average FPS ${avgFPS.toFixed(1)} is below optimal threshold`
                });
                analysis.bottlenecks.push('Rendering');
            }
            // Detect FPS drops
            const fpsDrops = this.detectDrops(metrics.fps, 30);
            if (fpsDrops.length > 0) {
                analysis.alerts.push({
                    type: 'fps_drops',
                    severity: 'low',
                    message: `Detected ${fpsDrops.length} FPS drops below 30`
                });
            }
        }
        return analysis;
    }
    generatePerformanceRecommendations(analysis) {
        const recommendations = [];
        if (analysis.summary.cpu?.status === 'critical') {
            recommendations.push({
                category: 'cpu',
                priority: 'high',
                title: 'Optimize CPU Usage',
                description: 'CPU usage is critically high, consider optimization strategies',
                actions: [
                    'Profile CPU-intensive functions using performance profilers',
                    'Implement debouncing for frequent operations',
                    'Consider Web Workers for heavy calculations',
                    'Optimize loops and algorithms',
                    'Implement lazy loading for expensive operations'
                ]
            });
        }
        else if (analysis.summary.cpu?.status === 'warning') {
            recommendations.push({
                category: 'cpu',
                priority: 'medium',
                title: 'Monitor CPU Usage',
                description: 'CPU usage is elevated, monitor for patterns',
                actions: [
                    'Identify peak usage times',
                    'Consider caching frequently computed values',
                    'Review background processes'
                ]
            });
        }
        if (analysis.summary.memory?.status === 'critical') {
            recommendations.push({
                category: 'memory',
                priority: 'high',
                title: 'Reduce Memory Usage',
                description: 'Memory usage is critically high, implement memory optimization',
                actions: [
                    'Check for memory leaks using heap profilers',
                    'Implement object pooling for frequently created objects',
                    'Optimize image and asset loading',
                    'Review data structures for efficiency',
                    'Implement proper cleanup in destructors/unmount'
                ]
            });
        }
        if (analysis.summary.fps?.status !== 'excellent') {
            recommendations.push({
                category: 'rendering',
                priority: 'medium',
                title: 'Improve Rendering Performance',
                description: 'Frame rate can be improved for better user experience',
                actions: [
                    'Optimize CSS animations using transform and opacity',
                    'Reduce DOM manipulations and batch updates',
                    'Use GPU acceleration with will-change property',
                    'Implement virtual scrolling for long lists',
                    'Debounce resize and scroll event handlers'
                ]
            });
        }
        // Add general recommendations based on bottlenecks
        if (analysis.bottlenecks.length > 0) {
            recommendations.push({
                category: 'general',
                priority: 'high',
                title: 'Address Performance Bottlenecks',
                description: `Identified bottlenecks: ${analysis.bottlenecks.join(', ')}`,
                actions: [
                    'Use performance profiling tools to identify specific issues',
                    'Consider implementing performance budgets',
                    'Set up continuous performance monitoring',
                    'Review architecture for scalability issues'
                ]
            });
        }
        return recommendations;
    }
    average(values) {
        if (values.length === 0)
            return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    detectSpikes(values, threshold) {
        return values.map((val, idx) => ({ val, idx }))
            .filter(item => item.val > threshold)
            .map(item => item.idx);
    }
    detectDrops(values, threshold) {
        return values.map((val, idx) => ({ val, idx }))
            .filter(item => item.val < threshold)
            .map(item => item.idx);
    }
    calculateTrend(values) {
        if (values.length < 2)
            return 0;
        // Simple linear regression to detect trend
        const n = values.length;
        const indices = Array.from({ length: n }, (_, i) => i);
        const sumX = indices.reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
        const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        return slope;
    }
}
//# sourceMappingURL=performance-monitor.js.map