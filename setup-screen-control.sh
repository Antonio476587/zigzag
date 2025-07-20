#!/bin/bash

# Setup script for screen control dependencies

echo "🖱️  Setting up screen control dependencies..."

# Detect platform
platform=$(uname -s)

case $platform in
    Linux*)
        echo "📋 Installing Linux dependencies..."
        
        # Check if we're on Ubuntu/Debian
        if command -v apt-get &> /dev/null; then
            echo "🔧 Installing xdotool for Linux screen control..."
            sudo apt-get update
            sudo apt-get install -y xdotool
        
        # Check if we're on Fedora/RHEL
        elif command -v dnf &> /dev/null; then
            echo "🔧 Installing xdotool for Linux screen control..."
            sudo dnf install -y xdotool
            
        # Check if we're on Arch
        elif command -v pacman &> /dev/null; then
            echo "🔧 Installing xdotool for Linux screen control..."
            sudo pacman -S --noconfirm xdotool
            
        else
            echo "❓ Unknown Linux distribution. Please install xdotool manually:"
            echo "   Ubuntu/Debian: sudo apt-get install xdotool"
            echo "   Fedora/RHEL:   sudo dnf install xdotool"
            echo "   Arch:          sudo pacman -S xdotool"
        fi
        ;;
        
    Darwin*)
        echo "📋 Installing macOS dependencies..."
        
        # Check if Homebrew is installed
        if command -v brew &> /dev/null; then
            echo "🔧 Installing cliclick for macOS screen control..."
            brew install cliclick
        else
            echo "❗ Homebrew not found. Please install Homebrew first:"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            echo "   Then run: brew install cliclick"
        fi
        ;;
        
    MINGW*|MSYS*|CYGWIN*)
        echo "📋 Windows detected..."
        echo "✅ Windows uses built-in PowerShell commands - no additional installation needed!"
        echo "📝 Note: You may need to run with administrator privileges for some actions."
        ;;
        
    *)
        echo "❌ Unsupported platform: $platform"
        echo "   Currently supported: Linux, macOS, Windows"
        exit 1
        ;;
esac

echo ""
echo "🧪 Testing screen control setup..."

# Test the installation
case $platform in
    Linux*)
        if command -v xdotool &> /dev/null; then
            echo "✅ xdotool installed successfully!"
            echo "📍 Current mouse position: $(xdotool getmouselocation)"
        else
            echo "❌ xdotool installation failed"
            exit 1
        fi
        ;;
        
    Darwin*)
        if command -v cliclick &> /dev/null; then
            echo "✅ cliclick installed successfully!"
            echo "📍 Current mouse position: $(cliclick p)"
        else
            echo "❌ cliclick installation failed"
            exit 1
        fi
        ;;
        
    MINGW*|MSYS*|CYGWIN*)
        echo "✅ Windows PowerShell ready for screen control"
        ;;
esac

echo ""
echo "🎉 Screen control setup completed!"
echo ""
echo "🔐 Security Notes:"
echo "   - Screen control requires accessibility permissions on macOS"
echo "   - Some Linux setups may require additional X11 permissions"
echo "   - Windows may require administrator privileges for some actions"
echo ""
echo "📚 Usage Examples:"
echo "   - Click at coordinates: screen_control with action='click', x=100, y=200"
echo "   - Type text: screen_control with action='type', text='Hello World'"
echo "   - Press keys: screen_control with action='key', key='ctrl+c'"
echo "   - Scroll: screen_control with action='scroll', direction='down'"
echo ""
echo "⚠️  Important: Use screen control responsibly and only on systems you own!"