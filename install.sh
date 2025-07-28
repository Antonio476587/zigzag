#!/bin/bash
# AI Agent MCP Toolbox Quick Installer

echo "Installing AI Agent MCP Toolbox..."

# Clone repository
git clone https://github.com/Antonio476587/zigzag.git ~/.ai-agent-toolbox
cd ~/.ai-agent-toolbox/ai-agent-mcp-toolbox

# Install dependencies
npm install
npm run build

# Setup platform tools
./setup-screen-control.sh

# Add to MCP config
CONFIG_FILE="$HOME/.config/claude/mcp_settings.json"
mkdir -p "$(dirname "$CONFIG_FILE")"

if [ ! -f "$CONFIG_FILE" ]; then
    echo '{"mcpServers": {}}' > "$CONFIG_FILE"
fi

# Update config using Node.js
node -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('$CONFIG_FILE', 'utf8'));
config.mcpServers['ai-agent-toolbox'] = {
    command: 'node',
    args: ['$HOME/.ai-agent-toolbox/ai-agent-mcp-toolbox/dist/index.js'],
    env: {}
};
fs.writeFileSync('$CONFIG_FILE', JSON.stringify(config, null, 2));
"

echo "✅ AI Agent MCP Toolbox installed successfully!"
echo "📝 Restart Claude Code to use the new tools"