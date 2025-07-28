# Installation Guide for AI Agent MCP Toolbox

## Quick Start for Users

### Option 1: Install from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/Antonio476587/zigzag.git
cd zigzag/ai-agent-mcp-toolbox

# Install dependencies
npm install

# Build the project
npm run build

# Install platform-specific dependencies
./setup-screen-control.sh  # Linux/macOS
# or
./setup-screen-control.ps1  # Windows
```

### Option 2: Direct MCP Configuration

Add to your Claude Code configuration (`~/.config/claude/mcp_settings.json`):

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

### Option 3: NPM Install (When Published)

```bash
# Install globally
npm install -g @origindot./zigzag

# Add to MCP config
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

## Available Tools

1. **Screenshot** - Capture screen/window/region
2. **UI Inspect** - Extract UI element hierarchy
3. **Performance Monitor** - Monitor app performance
4. **File Watcher** - Watch file changes
5. **Screen Control** - Mouse/keyboard automation

## Requirements

- Node.js 18+
- Platform-specific tools:
  - **Linux**: xdotool
  - **macOS**: cliclick
  - **Windows**: PowerShell

## Quick Test

```bash
# Test if MCP server is working
node dist/index.js

# In Claude Code, test with:
# "Take a screenshot"
# "Click at position 100, 100"
# "Type 'Hello World'"
```

## Support

- Issues: https://github.com/Antonio476587/zigzag/issues
- Documentation: https://github.com/Antonio476587/zigzag#readme