#!/usr/bin/env node

/**
 * Basic usage examples for AI Agent MCP Toolbox
 * 
 * This file demonstrates how to interact with the MCP server
 * using the JSON-RPC protocol.
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to send JSON-RPC request
async function sendRequest(server, request) {
  return new Promise((resolve) => {
    let response = '';
    
    const listener = (data) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (line.trim() && line.includes('jsonrpc')) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.id === request.id) {
              server.stdout.removeListener('data', listener);
              resolve(parsed);
            }
          } catch (e) {
            // Not JSON, ignore
          }
        }
      }
    };
    
    server.stdout.on('data', listener);
    server.stdin.write(JSON.stringify(request) + '\n');
  });
}

async function runExamples() {
  console.log('🚀 AI Agent MCP Toolbox Examples\n');

  // Start the MCP server
  const serverPath = join(__dirname, '..', 'dist', 'index.js');
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Initialize the server
  console.log('📡 Initializing MCP server...');
  await sendRequest(server, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'example-client',
        version: '1.0.0'
      }
    }
  });

  // List available tools
  console.log('\n📋 Available tools:');
  const toolsResponse = await sendRequest(server, {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list'
  });

  if (toolsResponse.result && toolsResponse.result.tools) {
    toolsResponse.result.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
  }

  // Example 1: Take a screenshot
  console.log('\n📸 Example 1: Taking a screenshot...');
  const screenshotResponse = await sendRequest(server, {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'screenshot',
      arguments: {
        target: 'screen',
        format: 'png'
      }
    }
  });

  if (screenshotResponse.result && !screenshotResponse.result.isError) {
    console.log('✅ Screenshot captured successfully!');
    if (screenshotResponse.result.content[0].type === 'image') {
      const size = Math.round(screenshotResponse.result.content[0].data.length / 1024);
      console.log(`   Size: ${size}KB (base64)`);
    }
  }

  // Example 2: UI Inspection
  console.log('\n🔍 Example 2: Inspecting UI elements...');
  const uiResponse = await sendRequest(server, {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'ui_inspect',
      arguments: {
        target: 'example-app'
      }
    }
  });

  if (uiResponse.result && !uiResponse.result.isError) {
    const data = JSON.parse(uiResponse.result.content[0].text);
    console.log('✅ UI inspection complete!');
    console.log(`   Elements found: ${data.metadata.element_count}`);
    console.log(`   Design patterns: ${data.analysis.design_patterns.join(', ')}`);
  }

  // Example 3: Performance Monitoring
  console.log('\n⚡ Example 3: Monitoring performance...');
  const perfResponse = await sendRequest(server, {
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'performance_monitor',
      arguments: {
        target: 'system',
        duration: 5
      }
    }
  });

  if (perfResponse.result && !perfResponse.result.isError) {
    const data = JSON.parse(perfResponse.result.content[0].text);
    console.log('✅ Performance monitoring complete!');
    console.log(`   CPU status: ${data.summary.cpu.status}`);
    console.log(`   Memory status: ${data.summary.memory.status}`);
  }

  // Example 4: File Watching
  console.log('\n👁️  Example 4: Setting up file watcher...');
  const watchResponse = await sendRequest(server, {
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: {
      name: 'file_watcher',
      arguments: {
        action: 'start',
        path: __dirname,
        pattern: '*.js',
        duration: 5,
        watch_id: 'example-watch'
      }
    }
  });

  if (watchResponse.result && !watchResponse.result.isError) {
    const data = JSON.parse(watchResponse.result.content[0].text);
    console.log('✅ File watcher started!');
    console.log(`   Watch ID: ${data.watch_id}`);
    console.log(`   Path: ${data.path}`);
  }

  // Clean up
  setTimeout(() => {
    console.log('\n🏁 Examples completed!');
    server.kill();
    process.exit(0);
  }, 7000);
}

// Run the examples
runExamples().catch(console.error);