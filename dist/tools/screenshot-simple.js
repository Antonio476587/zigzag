export class ScreenshotTool {
    definition = {
        name: 'screenshot',
        description: 'Capture screenshots (simplified version)',
        inputSchema: {
            type: 'object',
            properties: {
                target: {
                    type: 'string',
                    enum: ['screen'],
                    description: 'What to capture'
                }
            },
            required: ['target']
        }
    };
    async execute() {
        return {
            content: [{
                    type: 'text',
                    text: 'Screenshot functionality requires platform-specific dependencies. Please install with: npm install screenshot-desktop sharp'
                }],
            isError: false
        };
    }
}
//# sourceMappingURL=screenshot-simple.js.map