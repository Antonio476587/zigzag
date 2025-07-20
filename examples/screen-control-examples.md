# Screen Control Examples

The screen control tool allows AI agents to interact with the screen through mouse and keyboard actions. This enables automation, UI testing, and interactive demonstrations.

## 🖱️ Mouse Actions

### Click Actions
```javascript
// Left click at specific coordinates
{
  "action": "click",
  "x": 100,
  "y": 200
}

// Right click for context menu
{
  "action": "right_click", 
  "x": 300,
  "y": 150
}

// Double click to open/select
{
  "action": "double_click",
  "x": 400,
  "y": 250
}
```

### Mouse Movement
```javascript
// Move mouse to position
{
  "action": "move_mouse",
  "x": 500,
  "y": 300
}
```

### Drag and Drop
```javascript
// Drag from one point to another
{
  "action": "drag",
  "x": 100,      // Start position
  "y": 100,
  "end_x": 200,  // End position
  "end_y": 200
}
```

## ⌨️ Keyboard Actions

### Text Input
```javascript
// Type text
{
  "action": "type",
  "text": "Hello, World!"
}

// Type with special characters
{
  "action": "type", 
  "text": "user@example.com"
}
```

### Key Combinations
```javascript
// Copy (Ctrl+C)
{
  "action": "key",
  "key": "ctrl+c"
}

// Paste (Ctrl+V)
{
  "action": "key",
  "key": "ctrl+v"
}

// Save (Ctrl+S)
{
  "action": "key",
  "key": "ctrl+s"
}

// Undo (Ctrl+Z)
{
  "action": "key",
  "key": "ctrl+z"
}

// Alt+Tab (switch windows)
{
  "action": "key",
  "key": "alt+tab"
}
```

### Special Keys
```javascript
// Enter key
{
  "action": "key",
  "key": "enter"
}

// Escape key
{
  "action": "key",
  "key": "esc"
}

// Tab key
{
  "action": "key",
  "key": "tab"
}

// Delete key
{
  "action": "key",
  "key": "del"
}

// Space bar
{
  "action": "key",
  "key": "space"
}
```

## 🔄 Scrolling

### Basic Scrolling
```javascript
// Scroll down
{
  "action": "scroll",
  "scroll_direction": "down",
  "scroll_amount": 3
}

// Scroll up
{
  "action": "scroll",
  "scroll_direction": "up",
  "scroll_amount": 5
}
```

### Targeted Scrolling
```javascript
// Scroll at specific position
{
  "action": "scroll",
  "scroll_direction": "down",
  "x": 400,
  "y": 300,
  "scroll_amount": 2
}
```

## 🚀 Claude Code Usage Examples

### Basic Interactions
- *"Click at coordinates 100, 200"*
- *"Right click at the center of the screen"*
- *"Type 'Hello World' and press enter"*
- *"Press Ctrl+C to copy"*
- *"Scroll down 5 times"*

### UI Automation
- *"Click the save button, then type the filename and press enter"*
- *"Right-click on the desktop and select 'New Folder'"*
- *"Press Alt+Tab to switch to the next window"*
- *"Scroll to the bottom of the page"*

### Development Workflows
- *"Click in the code editor, select all text with Ctrl+A, then copy it"*
- *"Open the terminal with Ctrl+Shift+backtick and type 'npm start'"*
- *"Click the run button and wait for the application to start"*

### Form Filling
- *"Click in the username field and type my email address"*
- *"Tab to the password field and enter my password"*
- *"Click the login button"*

## ⚙️ Advanced Options

### Timing Control
```javascript
// Add delay after action
{
  "action": "click",
  "x": 100,
  "y": 200,
  "delay": 500  // Wait 500ms after clicking
}
```

### Mouse Buttons
```javascript
// Specify mouse button
{
  "action": "click",
  "x": 100,
  "y": 200,
  "button": "middle"  // left, right, or middle
}
```

## 🔐 Security and Safety

### Important Considerations
- **Use Responsibly**: Only use on systems you own or have permission to control
- **Privacy**: Be careful not to interact with sensitive information
- **Permissions**: May require accessibility permissions on macOS
- **Testing**: Always test in safe environments first

### Platform Requirements
- **Linux**: Requires `xdotool` (install with setup script)
- **macOS**: Requires `cliclick` (install with setup script)  
- **Windows**: Uses built-in PowerShell (no additional setup)

### Setup Commands
```bash
# Run setup script for your platform
./setup-screen-control.sh

# Or install manually:
# Linux: sudo apt-get install xdotool
# macOS: brew install cliclick
# Windows: No setup needed
```

## 🧪 Testing Examples

### Test Mouse Control
```javascript
// Move mouse in a square pattern
{
  "action": "move_mouse",
  "x": 100,
  "y": 100
}
// Then move to 200,100 -> 200,200 -> 100,200 -> back to 100,100
```

### Test Keyboard Control
```javascript
// Open notepad and type a message
{
  "action": "key",
  "key": "cmd+space"  // Open spotlight (macOS) or start menu (Windows)
}
// Then type "notepad" and press enter
// Then type a test message
```

### Test Combined Actions
```javascript
// Take screenshot, then manipulate what's shown
// 1. Take screenshot to see current state
// 2. Click on specific UI element
// 3. Type some text
// 4. Take another screenshot to verify changes
```

## 🎯 Use Cases

1. **UI Testing**: Automated testing of user interfaces
2. **Demonstrations**: Creating interactive demos and tutorials
3. **Accessibility**: Helping users with repetitive tasks
4. **Development**: Automating development workflows
5. **Data Entry**: Automated form filling and data input
6. **Quality Assurance**: Regression testing and user journey validation

Remember: Screen control is a powerful feature that should be used responsibly and ethically!