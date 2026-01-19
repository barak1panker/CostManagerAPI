'use strict';

const { spawn } = require('child_process');

function startProcess(cmd, args, readyText) {
  const child = spawn(cmd, args, { shell: true }); // Start a process (like a server)

  return new Promise(function (resolve, reject) {
    let resolved = false;

    child.stdout.on('data', function (data) {
      const text = data.toString();
      if (!resolved && text.includes(readyText)) {
        resolved = true;
        resolve(child); // Resolve when the process prints the ready text
      }
    });

    child.stderr.on('data', function (data) {
      const text = data.toString();
      if (!resolved && (text.includes('Fatal startup error') || text.includes('Error:'))) {
        reject(new Error(text)); // Stop tests if a critical error happens
      }
    });

    child.on('exit', function (code) {
      if (!resolved) {
        reject(new Error('process exited early with code ' + code));
      }
    });

    setTimeout(function () {
      if (!resolved) {
        reject(new Error('timeout waiting for process to be ready')); // Avoid waiting forever
      }
    }, 15000);
  });
}

function stopProcess(child) {
  if (!child) return;
  try {
    child.kill(); // Stop the process
  } catch (e) {
    // Ignore kill errors
  }
}

module.exports = { startProcess, stopProcess }; // Export helpers
