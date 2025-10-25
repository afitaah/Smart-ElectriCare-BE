#!/usr/bin/env node

/**
 * Kill process running on a specific port
 * Usage: node scripts/kill-port.js [port]
 * Default port: 5000
 */

const { exec } = require('child_process');
const os = require('os');

const port = process.argv[2] || 5000;
const isWindows = os.platform() === 'win32';

function killPort(port) {
  console.log(`🔍 Looking for processes using port ${port}...`);
  
  if (isWindows) {
    // Windows command
    exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ No processes found using port ${port}`);
        return;
      }
      
      const lines = stdout.trim().split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].includes(`:${port}`) && parts[3] === 'LISTENING') {
          pids.add(parts[4]);
        }
      });
      
      if (pids.size === 0) {
        console.log(`✅ Port ${port} is free`);
        return;
      }
      
      console.log(`🔫 Found ${pids.size} process(es) using port ${port}`);
      
      pids.forEach(pid => {
        exec(`taskkill /PID ${pid} /F`, (error, stdout, stderr) => {
          if (error) {
            console.log(`❌ Failed to kill process ${pid}: ${error.message}`);
          } else {
            console.log(`✅ Killed process ${pid}`);
          }
        });
      });
    });
  } else {
    // Unix/Linux/Mac command
    exec(`lsof -ti:${port}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`✅ Port ${port} is free`);
        return;
      }
      
      const pids = stdout.trim().split('\n').filter(pid => pid);
      
      if (pids.length === 0) {
        console.log(`✅ Port ${port} is free`);
        return;
      }
      
      console.log(`🔫 Found ${pids.length} process(es) using port ${port}`);
      
      pids.forEach(pid => {
        exec(`kill -9 ${pid}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`❌ Failed to kill process ${pid}: ${error.message}`);
          } else {
            console.log(`✅ Killed process ${pid}`);
          }
        });
      });
    });
  }
}

killPort(port);
