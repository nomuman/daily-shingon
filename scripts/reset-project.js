#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const TARGETS = ['.expo', '.expo-shared', '.turbo'];

for (const target of TARGETS) {
  const fullPath = path.join(PROJECT_ROOT, target);
  if (!fs.existsSync(fullPath)) continue;
  fs.rmSync(fullPath, { recursive: true, force: true });
  console.log(`Removed ${target}`);
}

console.log('Project cache reset completed.');
