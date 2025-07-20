import screenshot from 'screenshot-desktop';
import sharp from 'sharp';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';
export class ScreenshotTool {
    definition = {
        name: 'screenshot',
        description: 'Capture screenshots of the entire screen or specific applications',
        inputSchema: {
            type: 'object',
            properties: {
                target: {
                    type: 'string',
                    enum: ['screen', 'window', 'region'],
                    description: 'What to capture'
                },
                window_title: {
                    type: 'string',
                    description: 'Title of specific window to capture (for target="window")'
                },
                region: {
                    type: 'object',
                    properties: {
                        x: { type: 'number' },
                        y: { type: 'number' },
                        width: { type: 'number' },
                        height: { type: 'number' }
                    },
                    description: 'Specific region coordinates (for target="region")'
                },
                format: {
                    type: 'string',
                    enum: ['png', 'jpg', 'webp'],
                    default: 'png'
                },
                quality: {
                    type: 'number',
                    minimum: 1,
                    maximum: 100,
                    default: 90
                }
            },
            required: ['target']
        }
    };
    async execute(args) {
        try {
            let imageBuffer;
            switch (args.target) {
                case 'screen':
                    imageBuffer = await this.captureScreen();
                    break;
                case 'window':
                    if (!args.window_title) {
                        throw new Error('window_title is required for window capture');
                    }
                    imageBuffer = await this.captureWindow(args.window_title);
                    break;
                case 'region':
                    if (!args.region) {
                        throw new Error('region is required for region capture');
                    }
                    imageBuffer = await this.captureRegion(args.region);
                    break;
                default:
                    throw new Error('Invalid target type');
            }
            const processedImage = await this.processImage(imageBuffer, args.format || 'png', args.quality || 90);
            const metadata = await sharp(processedImage).metadata();
            return {
                content: [{
                        type: 'image',
                        data: processedImage.toString('base64'),
                        mimeType: `image/${args.format || 'png'}`
                    }],
                isError: false
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [{
                        type: 'text',
                        text: `Screenshot failed: ${errorMessage}`
                    }],
                isError: true
            };
        }
    }
    async captureScreen() {
        try {
            const tempFile = path.join(os.tmpdir(), `screenshot-${Date.now()}.png`);
            await screenshot({ filename: tempFile, format: 'png' });
            const buffer = await fs.readFile(tempFile);
            await fs.unlink(tempFile).catch(() => { }); // Clean up temp file
            return buffer;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('cannot find module')) {
                throw new Error('Screenshot desktop module not properly installed. Please reinstall dependencies.');
            }
            throw error;
        }
    }
    async captureWindow(title) {
        // For now, capture full screen and note that window-specific capture 
        // would require platform-specific implementation
        const fullScreen = await this.captureScreen();
        // In a full implementation, we would use platform-specific APIs:
        // - Windows: Win32 API via node-window-manager
        // - macOS: AppleScript or Quartz Window Services
        // - Linux: X11 or Wayland APIs
        // This is a placeholder that returns the full screen
        return fullScreen;
    }
    async captureRegion(region) {
        const fullScreen = await this.captureScreen();
        try {
            return await sharp(fullScreen)
                .extract({
                left: Math.round(region.x),
                top: Math.round(region.y),
                width: Math.round(region.width),
                height: Math.round(region.height)
            })
                .png()
                .toBuffer();
        }
        catch (error) {
            throw new Error(`Failed to extract region: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async processImage(buffer, format, quality) {
        const sharpInstance = sharp(buffer);
        switch (format) {
            case 'jpg':
            case 'jpeg':
                return await sharpInstance.jpeg({ quality }).toBuffer();
            case 'webp':
                return await sharpInstance.webp({ quality }).toBuffer();
            case 'png':
            default:
                return await sharpInstance.png({
                    compressionLevel: Math.floor((100 - quality) / 10)
                }).toBuffer();
        }
    }
}
//# sourceMappingURL=screenshot.js.map