#!/usr/bin/env node

const fs = require('fs');

const msgFile = process.argv[2] || '.git/COMMIT_EDITMSG';
let message = '';
try {
  message = fs.readFileSync(msgFile, 'utf8').trim();
} catch (e) {
  console.error('Could not read commit message file:', msgFile);
  process.exit(1);
}

// Basic check: disallow CJK characters to enforce English-only commit messages
const hasCJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufa6d\uff66-\uff9f]/.test(message);

if (hasCJK) {
  console.error('\nCommit message must be in English only.');
  console.error('Your message:');
  console.error(message);
  console.error('\nPlease rewrite the commit message in English.');
  process.exit(1);
}

// Optional: enforce short subject line
const subject = message.split('\n')[0];
if (subject.length > 72) {
  console.warn('Warning: subject is longer than 72 characters. Consider shortening.');
}

process.exit(0);



