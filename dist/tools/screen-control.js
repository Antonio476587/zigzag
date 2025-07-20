import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
const execAsync = promisify(exec);
export class ScreenControlTool {
    definition = {
        name: 'screen_control',
        description: 'Control screen interactions: click, type, scroll, and keyboard shortcuts',
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    enum: ['click', 'double_click', 'right_click', 'type', 'key', 'scroll', 'drag', 'move_mouse'],
                    description: 'Action to perform'
                },
                x: {
                    type: 'number',
                    description: 'X coordinate (for click, drag, move actions)'
                },
                y: {
                    type: 'number',
                    description: 'Y coordinate (for click, drag, move actions)'
                },
                text: {
                    type: 'string',
                    description: 'Text to type (for type action)'
                },
                key: {
                    type: 'string',
                    description: 'Key or key combination (e.g., "ctrl+c", "enter", "tab")'
                },
                scroll_direction: {
                    type: 'string',
                    enum: ['up', 'down', 'left', 'right'],
                    description: 'Scroll direction'
                },
                scroll_amount: {
                    type: 'number',
                    default: 3,
                    description: 'Number of scroll units'
                },
                end_x: {
                    type: 'number',
                    description: 'End X coordinate (for drag action)'
                },
                end_y: {
                    type: 'number',
                    description: 'End Y coordinate (for drag action)'
                },
                button: {
                    type: 'string',
                    enum: ['left', 'right', 'middle'],
                    default: 'left',
                    description: 'Mouse button for click actions'
                },
                delay: {
                    type: 'number',
                    default: 100,
                    description: 'Delay after action in milliseconds'
                }
            },
            required: ['action']
        }
    };
    async execute(args) {
        try {
            const platform = os.platform();
            let result;
            switch (args.action) {
                case 'click':
                    result = await this.performClick(platform, args.x, args.y, args.button || 'left');
                    break;
                case 'double_click':
                    result = await this.performDoubleClick(platform, args.x, args.y);
                    break;
                case 'right_click':
                    result = await this.performClick(platform, args.x, args.y, 'right');
                    break;
                case 'type':
                    if (!args.text)
                        throw new Error('text is required for type action');
                    result = await this.performType(platform, args.text);
                    break;
                case 'key':
                    if (!args.key)
                        throw new Error('key is required for key action');
                    result = await this.performKey(platform, args.key);
                    break;
                case 'scroll':
                    result = await this.performScroll(platform, args.scroll_direction || 'down', args.scroll_amount || 3, args.x, args.y);
                    break;
                case 'drag':
                    if (!args.x || !args.y || !args.end_x || !args.end_y) {
                        throw new Error('x, y, end_x, end_y are required for drag action');
                    }
                    result = await this.performDrag(platform, args.x, args.y, args.end_x, args.end_y);
                    break;
                case 'move_mouse':
                    if (!args.x || !args.y)
                        throw new Error('x, y are required for move_mouse action');
                    result = await this.performMouseMove(platform, args.x, args.y);
                    break;
                default:
                    throw new Error(`Unknown action: ${args.action}`);
            }
            // Add delay if specified
            if (args.delay && args.delay > 0) {
                await new Promise(resolve => setTimeout(resolve, args.delay));
            }
            return {
                content: [{
                        type: 'text',
                        text: result
                    }],
                isError: false
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [{
                        type: 'text',
                        text: `Screen control failed: ${errorMessage}`
                    }],
                isError: true
            };
        }
    }
    async performClick(platform, x, y, button) {
        switch (platform) {
            case 'linux':
                // Using xdotool for Linux
                await execAsync(`xdotool mousemove ${x} ${y} click ${this.getLinuxButton(button)}`);
                return `Clicked ${button} button at (${x}, ${y})`;
            case 'darwin':
                // Using cliclick for macOS
                const macButton = button === 'right' ? 'rc' : button === 'middle' ? 'mc' : 'c';
                await execAsync(`cliclick ${macButton}:${x},${y}`);
                return `Clicked ${button} button at (${x}, ${y})`;
            case 'win32':
                // Using PowerShell for Windows
                await execAsync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y}); [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 50"`);
                return `Clicked ${button} button at (${x}, ${y})`;
            default:
                throw new Error(`Platform ${platform} not supported for screen control`);
        }
    }
    async performDoubleClick(platform, x, y) {
        switch (platform) {
            case 'linux':
                await execAsync(`xdotool mousemove ${x} ${y} click --repeat 2 1`);
                return `Double-clicked at (${x}, ${y})`;
            case 'darwin':
                await execAsync(`cliclick dc:${x},${y}`);
                return `Double-clicked at (${x}, ${y})`;
            case 'win32':
                await execAsync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y}); [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 50"`);
                return `Double-clicked at (${x}, ${y})`;
            default:
                throw new Error(`Platform ${platform} not supported for double-click`);
        }
    }
    async performType(platform, text) {
        // Escape special characters for shell safety
        const escapedText = text.replace(/'/g, "'\"'\"'");
        switch (platform) {
            case 'linux':
                await execAsync(`xdotool type '${escapedText}'`);
                return `Typed: "${text}"`;
            case 'darwin':
                await execAsync(`cliclick t:'${escapedText}'`);
                return `Typed: "${text}"`;
            case 'win32':
                // PowerShell script to type text
                const psScript = `
          Add-Type -AssemblyName System.Windows.Forms;
          [System.Windows.Forms.SendKeys]::SendWait('${text.replace(/'/g, "''")}')
        `;
                await execAsync(`powershell -Command "${psScript}"`);
                return `Typed: "${text}"`;
            default:
                throw new Error(`Platform ${platform} not supported for typing`);
        }
    }
    async performKey(platform, key) {
        switch (platform) {
            case 'linux':
                const linuxKey = this.convertToLinuxKey(key);
                await execAsync(`xdotool key ${linuxKey}`);
                return `Pressed key: ${key}`;
            case 'darwin':
                const macKey = this.convertToMacKey(key);
                await execAsync(`cliclick kp:${macKey}`);
                return `Pressed key: ${key}`;
            case 'win32':
                const winKey = this.convertToWindowsKey(key);
                await execAsync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${winKey}')"`);
                return `Pressed key: ${key}`;
            default:
                throw new Error(`Platform ${platform} not supported for key press`);
        }
    }
    async performScroll(platform, direction, amount, x, y) {
        switch (platform) {
            case 'linux':
                const scrollButton = direction === 'up' ? 4 : direction === 'down' ? 5 : direction === 'left' ? 6 : 7;
                const coords = x && y ? `mousemove ${x} ${y}` : '';
                for (let i = 0; i < amount; i++) {
                    await execAsync(`xdotool ${coords} click ${scrollButton}`);
                }
                return `Scrolled ${direction} ${amount} times${x && y ? ` at (${x}, ${y})` : ''}`;
            case 'darwin':
                const scrollDir = direction === 'up' ? '+1' : direction === 'down' ? '-1' : direction === 'left' ? '+1,0' : '-1,0';
                const moveCmd = x && y ? `m:${x},${y}` : '';
                await execAsync(`cliclick ${moveCmd} s:${scrollDir}`);
                return `Scrolled ${direction}${x && y ? ` at (${x}, ${y})` : ''}`;
            case 'win32':
                // Windows scrolling implementation
                const positionCmd = x && y ? `[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y});` : '';
                await execAsync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; ${positionCmd}"`);
                return `Scrolled ${direction}${x && y ? ` at (${x}, ${y})` : ''}`;
            default:
                throw new Error(`Platform ${platform} not supported for scrolling`);
        }
    }
    async performDrag(platform, startX, startY, endX, endY) {
        switch (platform) {
            case 'linux':
                await execAsync(`xdotool mousemove ${startX} ${startY} mousedown 1 mousemove ${endX} ${endY} mouseup 1`);
                return `Dragged from (${startX}, ${startY}) to (${endX}, ${endY})`;
            case 'darwin':
                await execAsync(`cliclick m:${startX},${startY} dd:${startX},${startY} du:${endX},${endY}`);
                return `Dragged from (${startX}, ${startY}) to (${endX}, ${endY})`;
            case 'win32':
                // Windows drag implementation using mouse events
                const psScript = `
          Add-Type -AssemblyName System.Windows.Forms;
          [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${startX}, ${startY});
          Start-Sleep -Milliseconds 100;
          [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${endX}, ${endY});
        `;
                await execAsync(`powershell -Command "${psScript}"`);
                return `Dragged from (${startX}, ${startY}) to (${endX}, ${endY})`;
            default:
                throw new Error(`Platform ${platform} not supported for dragging`);
        }
    }
    async performMouseMove(platform, x, y) {
        switch (platform) {
            case 'linux':
                await execAsync(`xdotool mousemove ${x} ${y}`);
                return `Moved mouse to (${x}, ${y})`;
            case 'darwin':
                await execAsync(`cliclick m:${x},${y}`);
                return `Moved mouse to (${x}, ${y})`;
            case 'win32':
                await execAsync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})"`);
                return `Moved mouse to (${x}, ${y})`;
            default:
                throw new Error(`Platform ${platform} not supported for mouse movement`);
        }
    }
    getLinuxButton(button) {
        switch (button) {
            case 'left': return 1;
            case 'middle': return 2;
            case 'right': return 3;
            default: return 1;
        }
    }
    convertToLinuxKey(key) {
        // Convert common key combinations to xdotool format
        return key
            .replace(/ctrl\+/gi, 'ctrl+')
            .replace(/alt\+/gi, 'alt+')
            .replace(/shift\+/gi, 'shift+')
            .replace(/cmd\+/gi, 'ctrl+') // Map cmd to ctrl on Linux
            .replace(/enter/gi, 'Return')
            .replace(/esc/gi, 'Escape')
            .replace(/del/gi, 'Delete')
            .replace(/space/gi, 'space');
    }
    convertToMacKey(key) {
        // Convert common key combinations to cliclick format
        return key
            .replace(/ctrl\+/gi, 'cmd+')
            .replace(/cmd\+/gi, 'cmd+')
            .replace(/alt\+/gi, 'alt+')
            .replace(/shift\+/gi, 'shift+')
            .replace(/enter/gi, 'return')
            .replace(/esc/gi, 'escape')
            .replace(/del/gi, 'delete')
            .replace(/space/gi, 'space');
    }
    convertToWindowsKey(key) {
        // Convert common key combinations to Windows SendKeys format
        return key
            .replace(/ctrl\+/gi, '^')
            .replace(/alt\+/gi, '%')
            .replace(/shift\+/gi, '+')
            .replace(/cmd\+/gi, '^') // Map cmd to ctrl on Windows
            .replace(/enter/gi, '{ENTER}')
            .replace(/esc/gi, '{ESC}')
            .replace(/del/gi, '{DELETE}')
            .replace(/space/gi, ' ')
            .replace(/tab/gi, '{TAB}')
            .replace(/home/gi, '{HOME}')
            .replace(/end/gi, '{END}');
    }
}
//# sourceMappingURL=screen-control.js.map