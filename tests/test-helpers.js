'use strict';

const { spawn } = require('child_process');

function startProcess(cmd, args, readyText) {
  const child = spawn(cmd, args, { shell: true });

  return new Promise(function (resolve, reject) {
    let resolved = false;

    child.stdout.on('data', function (data) {
      const text = data.toString();
      if (!resolved && text.includes(readyText)) {
        resolved = true;
        resolve(child);
      }
    });

    child.stderr.on('data', function (data) {
      // אם יש שגיאה קריטית, הטסטים לא יתקעו בלי סוף
      const text = data.toString();
      if (!resolved && (text.includes('Fatal startup error') || text.includes('Error:'))) {
        reject(new Error(text));
      }
    });

    child.on('exit', function (code) {
      if (!resolved) {
        reject(new Error('process exited early with code ' + code));
      }
    });

    // timeout קטן שלא יתקע
    setTimeout(function () {
      if (!resolved) {
        reject(new Error('timeout waiting for process to be ready'));
      }
    }, 15000);
  });
}

function stopProcess(child) {
  if (!child) {
    return;
  }
  try {
    child.kill();
  } catch (e) {
  }
}

module.exports = {
  startProcess: startProcess,
  stopProcess: stopProcess
};
