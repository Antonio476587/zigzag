import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, unlink } from 'fs/promises';
import { Tool, ToolResult } from '../types/tools.js';
import * as os from 'os';
import * as path from 'path';

const execAsync = promisify(exec);

export class ScreenshotTool implements Tool {
  definition = {
    name: 'screenshot',
    description: 'Capture screenshots using system commands (cross-platform)',
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
        output_path: {
          type: 'string',
          description: 'Optional output file path (defaults to temp file)'
        },
        format: {
          type: 'string',
          enum: ['png', 'jpg', 'bmp'],
          default: 'png'
        }
      },
      required: ['target']
    }
  };

  async execute(args: any): Promise<ToolResult> {
    try {
      const platform = os.platform();
      const tempDir = os.tmpdir();
      const timestamp = Date.now();
      const format = args.format || 'png';
      const outputPath = args.output_path || path.join(tempDir, `screenshot-${timestamp}.${format}`);

      let success = false;

      switch (args.target) {
        case 'screen':
          success = await this.captureScreen(outputPath, platform);
          break;
        case 'window':
          if (!args.window_title) {
            throw new Error('window_title is required for window capture');
          }
          success = await this.captureWindow(outputPath, args.window_title, platform);
          break;
        case 'region':
          if (!args.region) {
            throw new Error('region is required for region capture');
          }
          success = await this.captureRegion(outputPath, args.region, platform);
          break;
        default:
          throw new Error('Invalid target type');
      }

      if (!success) {
        throw new Error('Screenshot capture failed');
      }

      // Read the image file and convert to base64
      const imageBuffer = await readFile(outputPath);
      const base64Image = imageBuffer.toString('base64');

      // Clean up temp file if we created it
      if (!args.output_path) {
        await unlink(outputPath).catch(() => {}); // Ignore cleanup errors
      }

      return {
        content: [{
          type: 'image',
          data: base64Image,
          mimeType: `image/${format}`
        }, {
          type: 'text',
          text: `Screenshot captured successfully (${imageBuffer.length} bytes)`
        }],
        isError: false
      };
    } catch (error) {
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

  private async captureScreen(outputPath: string, platform: string): Promise<boolean> {
    try {
      switch (platform) {
        case 'linux':
          // Try multiple methods for Linux
          const linuxCommands = [
            `import -window root "${outputPath}"`,           // ImageMagick
            `gnome-screenshot -f "${outputPath}"`,           // GNOME
            `scrot "${outputPath}"`,                         // Scrot
            `spectacle -b -o "${outputPath}"`,               // KDE Spectacle
            `maim "${outputPath}"`                           // Maim
          ];
          
          for (const cmd of linuxCommands) {
            try {
              await execAsync(cmd);
              return true;
            } catch (e) {
              continue; // Try next command
            }
          }
          return false;

        case 'darwin':
          // macOS
          await execAsync(`screencapture "${outputPath}"`);
          return true;

        case 'win32':
          // Windows using PowerShell
          const psScript = `
            Add-Type -AssemblyName System.Windows.Forms;
            $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds;
            $bitmap = New-Object System.Drawing.Bitmap $screen.Width, $screen.Height;
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap);
            $graphics.CopyFromScreen(0, 0, 0, 0, $bitmap.Size);
            $bitmap.Save("${outputPath}", [System.Drawing.Imaging.ImageFormat]::Png);
            $graphics.Dispose();
            $bitmap.Dispose();
          `;
          await execAsync(`powershell -Command "${psScript}"`);
          return true;

        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error('Screen capture error:', error);
      return false;
    }
  }

  private async captureWindow(outputPath: string, windowTitle: string, platform: string): Promise<boolean> {
    try {
      switch (platform) {
        case 'linux':
          // Get window ID by title and capture it
          const { stdout } = await execAsync(`xwininfo -name "${windowTitle}" | grep "Window id" | awk '{print $4}'`);
          const windowId = stdout.trim();
          if (windowId) {
            await execAsync(`import -window ${windowId} "${outputPath}"`);
            return true;
          }
          return false;

        case 'darwin':
          // macOS - capture specific window
          await execAsync(`screencapture -l$(osascript -e 'tell app "${windowTitle}" to id of window 1') "${outputPath}"`);
          return true;

        case 'win32':
          // Windows - find and capture window
          const psWindowScript = `
            Add-Type -AssemblyName System.Windows.Forms;
            $processes = Get-Process | Where-Object {$_.MainWindowTitle -like "*${windowTitle}*"};
            if ($processes) {
              $hwnd = $processes[0].MainWindowHandle;
              # Window capture logic would go here
              # For now, fall back to full screen
              $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds;
              $bitmap = New-Object System.Drawing.Bitmap $screen.Width, $screen.Height;
              $graphics = [System.Drawing.Graphics]::FromImage($bitmap);
              $graphics.CopyFromScreen(0, 0, 0, 0, $bitmap.Size);
              $bitmap.Save("${outputPath}", [System.Drawing.Imaging.ImageFormat]::Png);
              $graphics.Dispose();
              $bitmap.Dispose();
            }
          `;
          await execAsync(`powershell -Command "${psWindowScript}"`);
          return true;

        default:
          throw new Error(`Window capture not supported on platform: ${platform}`);
      }
    } catch (error) {
      console.error('Window capture error:', error);
      return false;
    }
  }

  private async captureRegion(outputPath: string, region: any, platform: string): Promise<boolean> {
    try {
      const { x, y, width, height } = region;

      switch (platform) {
        case 'linux':
          // ImageMagick import with geometry
          await execAsync(`import -window root -crop ${width}x${height}+${x}+${y} "${outputPath}"`);
          return true;

        case 'darwin':
          // macOS screencapture with region
          await execAsync(`screencapture -R ${x},${y},${width},${height} "${outputPath}"`);
          return true;

        case 'win32':
          // Windows PowerShell with region
          const psRegionScript = `
            Add-Type -AssemblyName System.Windows.Forms;
            $bitmap = New-Object System.Drawing.Bitmap ${width}, ${height};
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap);
            $graphics.CopyFromScreen(${x}, ${y}, 0, 0, $bitmap.Size);
            $bitmap.Save("${outputPath}", [System.Drawing.Imaging.ImageFormat]::Png);
            $graphics.Dispose();
            $bitmap.Dispose();
          `;
          await execAsync(`powershell -Command "${psRegionScript}"`);
          return true;

        default:
          throw new Error(`Region capture not supported on platform: ${platform}`);
      }
    } catch (error) {
      console.error('Region capture error:', error);
      return false;
    }
  }
}