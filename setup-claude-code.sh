#!/bin/bash

# Setup script for Claude Code integration

echo "🚀 Setting up AI Agent MCP Toolbox for Claude Code..."

# Get the absolute path to the built server
TOOLBOX_PATH="$(pwd)/dist/index.js"

echo "📍 Toolbox location: $TOOLBOX_PATH"

# Create Claude Code config directory if it doesn't exist
CLAUDE_CONFIG_DIR="$HOME/.config/claude-code"
if [ ! -d "$CLAUDE_CONFIG_DIR" ]; then
    echo "📁 Creating Claude Code config directory..."
    mkdir -p "$CLAUDE_CONFIG_DIR"
fi

# Create or update the settings.json file
SETTINGS_FILE="$CLAUDE_CONFIG_DIR/settings.json"

echo "⚙️  Creating/updating Claude Code settings..."

cat > "$SETTINGS_FILE" << EOF
{
  "mcpServers": {
    "ai-agent-toolbox": {
      "command": "node",
      "args": ["$TOOLBOX_PATH"]
    }
  }
}
EOF

echo "✅ Configuration written to: $SETTINGS_FILE"

echo "
🎉 Setup completed!

To use the AI Agent MCP Toolbox with Claude Code:

1. Make sure Claude Code is installed
2. Restart Claude Code to load the new configuration
3. The following tools will be available:
   📸 screenshot - Capture screen images
   🔍 ui_inspect - Analyze UI element hierarchies
   ⚡ performance_monitor - Monitor system performance

Example usage in Claude Code:
- \"Take a screenshot of my screen\"
- \"Inspect the UI of my terminal application\"
- \"Monitor the performance of my app for 30 seconds\"

Configuration file: $SETTINGS_FILE
Server path: $TOOLBOX_PATH
"