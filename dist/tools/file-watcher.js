import { watch } from 'chokidar';
export class FileWatcherTool {
    watchers = new Map();
    definition = {
        name: 'file_watcher',
        description: 'Watch files and directories for changes',
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['start', 'stop', 'status'],
                    description: 'Action to perform'
                },
                path: {
                    type: 'string',
                    description: 'File or directory path to watch'
                },
                pattern: {
                    type: 'string',
                    description: 'Glob pattern to filter files (e.g., "*.js", "**/*.ts")'
                },
                events: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['add', 'change', 'unlink', 'addDir', 'unlinkDir']
                    },
                    default: ['add', 'change', 'unlink'],
                    description: 'Events to watch for'
                },
                watch_id: {
                    type: 'string',
                    description: 'Unique identifier for this watcher (for stop/status actions)'
                },
                duration: {
                    type: 'number',
                    description: 'Duration to watch in seconds (0 = unlimited)',
                    default: 60
                }
            },
            required: ['action']
        }
    };
    async execute(args) {
        try {
            switch (args.action) {
                case 'start':
                    return await this.startWatching(args);
                case 'stop':
                    return await this.stopWatching(args);
                case 'status':
                    return await this.getStatus(args);
                default:
                    throw new Error('Invalid action. Use: start, stop, or status');
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [{
                        type: 'text',
                        text: `File watcher error: ${errorMessage}`
                    }],
                isError: true
            };
        }
    }
    async startWatching(args) {
        if (!args.path) {
            throw new Error('path is required for start action');
        }
        const watchId = args.watch_id || `watch_${Date.now()}`;
        const duration = args.duration || 60;
        const events = args.events || ['add', 'change', 'unlink'];
        if (this.watchers.has(watchId)) {
            throw new Error(`Watcher with ID '${watchId}' already exists`);
        }
        const watchPath = args.pattern ? `${args.path}/${args.pattern}` : args.path;
        const changeLog = [];
        const watcher = watch(watchPath, {
            ignored: /node_modules|\.git/,
            persistent: true,
            ignoreInitial: true
        });
        const watcherInfo = {
            watcher,
            path: args.path,
            pattern: args.pattern,
            events,
            changes: changeLog,
            startTime: new Date(),
            active: true
        };
        // Set up event listeners
        events.forEach((event) => {
            watcher.on(event, (filePath) => {
                const change = {
                    event,
                    path: filePath,
                    timestamp: new Date().toISOString()
                };
                changeLog.push(change);
                console.log(`[${watchId}] ${event}: ${filePath}`);
            });
        });
        // Auto-stop after duration (if specified and > 0)
        if (duration > 0) {
            setTimeout(() => {
                if (this.watchers.has(watchId)) {
                    watcher.close();
                    watcherInfo.active = false;
                    console.log(`[${watchId}] Auto-stopped after ${duration} seconds`);
                }
            }, duration * 1000);
        }
        this.watchers.set(watchId, watcherInfo);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        message: 'File watcher started',
                        watch_id: watchId,
                        path: args.path,
                        pattern: args.pattern || 'all files',
                        events: events,
                        duration: duration > 0 ? `${duration} seconds` : 'unlimited',
                        instructions: `Use file_watcher with action="status" and watch_id="${watchId}" to check results`
                    }, null, 2)
                }],
            isError: false
        };
    }
    async stopWatching(args) {
        if (!args.watch_id) {
            throw new Error('watch_id is required for stop action');
        }
        const watcherInfo = this.watchers.get(args.watch_id);
        if (!watcherInfo) {
            throw new Error(`No watcher found with ID '${args.watch_id}'`);
        }
        watcherInfo.watcher.close();
        watcherInfo.active = false;
        const summary = {
            watch_id: args.watch_id,
            path: watcherInfo.path,
            duration: ((Date.now() - watcherInfo.startTime.getTime()) / 1000).toFixed(1) + ' seconds',
            total_changes: watcherInfo.changes.length,
            changes: watcherInfo.changes
        };
        this.watchers.delete(args.watch_id);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        message: 'File watcher stopped',
                        summary
                    }, null, 2)
                }],
            isError: false
        };
    }
    async getStatus(args) {
        if (args.watch_id) {
            // Status for specific watcher
            const watcherInfo = this.watchers.get(args.watch_id);
            if (!watcherInfo) {
                throw new Error(`No watcher found with ID '${args.watch_id}'`);
            }
            const status = {
                watch_id: args.watch_id,
                active: watcherInfo.active,
                path: watcherInfo.path,
                pattern: watcherInfo.pattern || 'all files',
                events: watcherInfo.events,
                start_time: watcherInfo.startTime.toISOString(),
                duration: ((Date.now() - watcherInfo.startTime.getTime()) / 1000).toFixed(1) + ' seconds',
                changes_detected: watcherInfo.changes.length,
                recent_changes: watcherInfo.changes.slice(-10) // Last 10 changes
            };
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify(status, null, 2)
                    }],
                isError: false
            };
        }
        else {
            // Status for all watchers
            const allWatchers = Array.from(this.watchers.entries()).map(([id, info]) => ({
                watch_id: id,
                active: info.active,
                path: info.path,
                pattern: info.pattern || 'all files',
                start_time: info.startTime.toISOString(),
                changes_detected: info.changes.length
            }));
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            active_watchers: allWatchers.length,
                            watchers: allWatchers
                        }, null, 2)
                    }],
                isError: false
            };
        }
    }
}
//# sourceMappingURL=file-watcher.js.map