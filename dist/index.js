#!/usr/bin/env node
import { AIAgentToolboxServer } from './server.js';
async function main() {
    try {
        const server = new AIAgentToolboxServer();
        await server.start();
        process.stderr.write('AI Agent MCP Toolbox server started successfully\n');
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map