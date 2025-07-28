# AI Agent MCP Toolbox

🚀 A comprehensive MCP (Model Context Protocol) server that empowers AI agents with visual, development, and system monitoring capabilities.

## ✨ Features

- 📸 **Cross-Platform Screenshots** - Capture screens, windows, or regions on Linux/macOS/Windows
- 🔍 **UI Element Inspection** - Extract UI hierarchies with accessibility analysis
- ⚡ **Performance Monitoring** - Real-time system metrics and performance analysis
- 👁️ **File System Watching** - Monitor file/directory changes in real-time
- 🖱️ **Screen Control** - Click, type, scroll, and keyboard automation for AI agents
- 🎯 **Claude Code Integration** - Seamless integration with Claude Code IDE

## 🎯 Why This Matters

AI agents typically face constraints when working with visual interfaces and real-time system monitoring. This toolbox bridges that gap by providing:

- **Visual Capabilities**: Take screenshots and analyze UI elements
- **Development Tools**: Monitor file changes and system performance  
- **Accessibility Auditing**: Check UI compliance and design patterns
- **Cross-Platform Support**: Works on Linux, macOS, and Windows

Perfect for AI-assisted development, UI/UX testing, system monitoring, and accessibility auditing.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Claude Code (for AI agent integration)

### Installation

#### Option 1: NPM Install (Recommended)

```bash
# Install globally
npm install -g @origindot./zigzag

# The package will be ready to use with Claude Code
```

#### Option 2: From Source

```bash
# Clone the repository
git clone https://github.com/Antonio476587/zigzag.git
cd zigzag/ai-agent-mcp-toolbox

# Install dependencies
npm install

# Build the project
npm run build

# Set up platform dependencies
./setup-screen-control.sh  # Linux/macOS
```

#### Option 3: One-Line Installer

```bash
curl -sSL https://raw.githubusercontent.com/Antonio476587/zigzag/main/ai-agent-mcp-toolbox/install.sh | bash
```

### Claude Code Configuration

#### For NPM Installation:
Add to your `~/.config/claude/mcp_settings.json`:

```json
{
  "mcpServers": {
    "ai-agent-toolbox": {
      "command": "npx",
      "args": ["@origindot./zigzag"],
      "env": {}
    }
  }
}
```

#### For Source Installation:
```json
{
  "mcpServers": {
    "ai-agent-toolbox": {
      "command": "node",
      "args": ["/path/to/zigzag/ai-agent-mcp-toolbox/dist/index.js"],
      "env": {}
    }
  }
}
```

## 🛠️ Available Tools

### 📸 Screenshot Tool

Capture screenshots using system commands with cross-platform compatibility.

**Usage in Claude Code:**
- *"Take a screenshot of my screen"*
- *"Capture the current window"*  
- *"Screenshot a specific region"*

**Parameters:**
- `target`: 'screen' | 'window' | 'region'
- `format`: 'png' | 'jpg' | 'bmp' (default: 'png')
- `window_title`: Title of window to capture (for window target)
- `region`: `{x, y, width, height}` (for region target)

### 🔍 UI Inspect Tool

Analyze UI element hierarchies and check accessibility compliance.

**Usage in Claude Code:**
- *"Inspect the UI of my browser"*
- *"Analyze accessibility issues in my app"*
- *"Extract UI element hierarchy"*

**Features:**
- UI element tree extraction
- Accessibility issue detection
- Design pattern identification
- WCAG compliance checking

### ⚡ Performance Monitor Tool

Monitor system performance with detailed metrics and recommendations.

**Usage in Claude Code:**
- *"Monitor my application's performance for 60 seconds"*
- *"Check system CPU and memory usage"*
- *"Analyze performance bottlenecks"*

**Metrics:**
- CPU usage and trends
- Memory consumption
- GPU utilization (when available)
- Network I/O
- FPS monitoring
- Performance recommendations

### 👁️ File Watcher Tool

Monitor file and directory changes in real-time.

**Usage in Claude Code:**
- *"Watch my src folder for JavaScript changes"*
- *"Monitor project files for modifications"*
- *"Set up file watching for hot reload"*

**Features:**
- Multi-pattern file watching
- Event filtering (add, change, delete)
- Duration-based monitoring
- Status reporting

### 🖱️ Screen Control Tool

Automate mouse and keyboard interactions for AI agents.

**Usage in Claude Code:**
- *"Click at position 100, 200"*
- *"Type 'Hello World'"*
- *"Press Ctrl+C"*
- *"Scroll down 3 times"*
- *"Drag from 100,100 to 200,200"*

**Actions:**
- `click`, `double_click`, `right_click`: Mouse clicking
- `type`: Text input
- `key`: Keyboard shortcuts and special keys
- `scroll`: Scroll in any direction
- `drag`: Drag and drop operations
- `move_mouse`: Mouse positioning

**Cross-Platform Support:**
- **Linux**: Uses `xdotool`
- **macOS**: Uses `cliclick` 
- **Windows**: Uses PowerShell automation

## 🧪 Testing

Run the included tests to verify functionality:

```bash
# Test individual tools
npm test

# Manual testing
node dist/index.js
```

## 📚 Examples

### Basic Screenshot
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"screenshot","arguments":{"target":"screen"}}}' | node dist/index.js
```

### UI Inspection
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"ui_inspect","arguments":{"target":"browser"}}}' | node dist/index.js
```

### File Watching
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"file_watcher","arguments":{"action":"start","path":"/path/to/watch","pattern":"*.js"}}}' | node dist/index.js
```

## 🏗️ Architecture

```
src/
├── index.ts          # MCP server entry point
├── server.ts         # Main server implementation  
├── types/            # TypeScript type definitions
├── tools/            # Individual tool implementations
│   ├── screenshot-system.ts
│   ├── ui-inspect-simple.ts
│   ├── performance-monitor-simple.ts
│   └── file-watcher.ts
└── utils/            # Utility functions
```

## 🌍 Platform Support

| Platform | Screenshot | UI Inspect | Performance | File Watch | Screen Control |
|----------|------------|------------|-------------|------------|----------------|
| Linux    | ✅ Full    | ✅ Basic   | ✅ Full     | ✅ Full    | ✅ Full        |
| macOS    | ✅ Full    | ✅ Basic   | ✅ Full     | ✅ Full    | ✅ Full        |
| Windows  | ✅ Full    | ✅ Basic   | ✅ Full     | ✅ Full    | ✅ Full        |

### Platform-Specific Notes

**Linux:** 
- Screenshots: Uses system commands (`import`, `gnome-screenshot`, `scrot`, etc.)
- Screen Control: Requires `xdotool` (`sudo apt install xdotool`)

**macOS:** 
- Screenshots: Built-in `screencapture` command
- Screen Control: Requires `cliclick` (`brew install cliclick`)

**Windows:** 
- Screenshots: PowerShell with System.Drawing
- Screen Control: Built-in PowerShell automation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests, report bugs, or suggest features.

### Development Setup

```bash
# Clone and install
git clone https://github.com/Antonio476587/zigzag.git
cd zigzag/ai-agent-mcp-toolbox
npm install

# Install platform dependencies
./setup-screen-control.sh  # Linux/macOS

# Development mode
npm run dev

# Build
npm run build

# Lint
npm run lint

# Test
npm test
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on the [Model Context Protocol](https://modelcontextprotocol.io/) 
- Inspired by the need for AI agents to interact with visual interfaces
- Thanks to the Claude Code team for MCP integration

## 🆘 Troubleshooting

### Screenshots Not Working

**Linux:** Install required screenshot tools:
```bash
# Ubuntu/Debian
sudo apt-get install imagemagick scrot

# Fedora
sudo dnf install ImageMagick scrot
```

**macOS:** No additional setup required

**Windows:** Ensure PowerShell execution policy allows scripts

### Performance Monitoring Issues

Some metrics require elevated permissions. Run with appropriate privileges if needed.

### File Watcher Not Responding

Check file permissions and ensure the target directory exists and is accessible.

## 📞 Support

For issues, questions, or feature requests, please:
1. Check the troubleshooting section above
2. Search existing issues on [GitHub](https://github.com/Antonio476587/zigzag/issues)
3. Create a new issue with detailed information

### Package Information
- **npm**: `@origindot./zigzag`
- **GitHub**: https://github.com/Antonio476587/zigzag
- **Documentation**: https://github.com/Antonio476587/zigzag#readme

---

**Made with ❤️ for the AI development community**