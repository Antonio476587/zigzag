# Claude Code Usage Examples

This file contains example commands you can use with Claude Code once the AI Agent MCP Toolbox is configured.

## 📸 Screenshot Examples

### Basic Screenshots
- *"Take a screenshot of my screen"*
- *"Capture my desktop"*
- *"Take a screenshot in PNG format"*

### Window Screenshots
- *"Take a screenshot of my browser window"*
- *"Capture the VS Code window"*
- *"Screenshot the terminal window"*

### Region Screenshots
- *"Take a screenshot of the top-left corner, 800x600 pixels"*
- *"Capture a region starting at coordinates 100,100 with size 500x400"*

### Advanced Screenshots
- *"Take a screenshot in 5 seconds"*
- *"Capture my screen and save it as JPG"*
- *"Take a screenshot of a specific area and analyze it"*

## 🔍 UI Inspection Examples

### Basic UI Analysis
- *"Inspect the UI elements of my browser"*
- *"Analyze my application's interface"*
- *"Extract the UI hierarchy from my desktop"*

### Accessibility Analysis
- *"Check my app for accessibility issues"*
- *"Analyze WCAG compliance of my interface"*
- *"Find accessibility problems in my UI"*

### Design Pattern Analysis
- *"Identify design patterns in my application"*
- *"Analyze the UI structure of my website"*
- *"Extract navigation elements from my app"*

## ⚡ Performance Monitoring Examples

### System Monitoring
- *"Monitor my system performance for 60 seconds"*
- *"Check CPU and memory usage"*
- *"Analyze system performance while running my app"*

### Application Monitoring
- *"Monitor my Node.js application's performance"*
- *"Check performance metrics for the next 2 minutes"*
- *"Analyze bottlenecks in my application"*

### Performance Analysis
- *"Give me performance recommendations"*
- *"Check if my system is under stress"*
- *"Monitor FPS while gaming"*

## 👁️ File Watching Examples

### Development Workflows
- *"Watch my src folder for JavaScript changes"*
- *"Monitor my project files for modifications"*
- *"Set up file watching for hot reload development"*

### Specific File Patterns
- *"Watch for TypeScript file changes in my project"*
- *"Monitor CSS files in my styles directory"*
- *"Watch for any file changes in my components folder"*

### Advanced File Watching
- *"Start watching files and tell me when something changes"*
- *"Monitor my config files for the next 10 minutes"*
- *"Watch for new files being added to my downloads folder"*

## 🔗 Combining Tools

### Development Workflow
- *"Take a screenshot of my app, then monitor its performance for 30 seconds"*
- *"Inspect my UI and check for accessibility issues"*
- *"Watch my source files and take a screenshot when something changes"*

### Testing Workflow
- *"Take a screenshot, analyze the UI, and check performance"*
- *"Monitor file changes while taking periodic screenshots"*
- *"Inspect UI elements and provide accessibility recommendations"*

### Debugging Workflow
- *"Take a screenshot, inspect the UI hierarchy, and monitor performance"*
- *"Watch for file changes and take screenshots of any UI updates"*
- *"Monitor system performance while watching my log files"*

## 💡 Pro Tips

1. **Be Specific**: The more specific your request, the better the results
   - Instead of: *"Take a screenshot"*
   - Try: *"Take a PNG screenshot of my browser window"*

2. **Combine Actions**: You can ask for multiple operations in sequence
   - *"Take a screenshot, then analyze its UI elements for accessibility issues"*

3. **Time-based Operations**: Specify durations for monitoring tasks
   - *"Monitor performance for 2 minutes and give me a summary"*

4. **File Patterns**: Use specific patterns when watching files
   - *"Watch for changes in *.tsx files in my components directory"*

5. **Context Matters**: Provide context about what you're working on
   - *"I'm developing a React app, take a screenshot and analyze the component structure"*

## 🚨 Common Issues

### Permission Errors
If screenshots fail, you may need to grant screen recording permissions:
- **macOS**: System Preferences → Security & Privacy → Privacy → Screen Recording
- **Linux**: Ensure you have the required screenshot tools installed
- **Windows**: Run with appropriate permissions

### File Watching Issues
- Ensure the target directory exists and is accessible
- Check file permissions for the directories you want to monitor
- Some network drives may not support file watching

### Performance Monitoring Limitations
- Some metrics require elevated permissions
- GPU monitoring may not be available on all systems
- Network metrics depend on your system configuration