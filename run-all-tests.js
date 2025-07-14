const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Array of test files to run
const testFiles = [
  'core-functionality.test.js',
  'module-analysis.test.js',
  'feature-flags.test.js',
  'cross-platform.test.js'
];

// Results tracking
const results = {
  total: testFiles.length,
  passed: 0,
  failed: 0,
  failures: []
};

// Function to run a test file
async function runTest(testFile) {
  return new Promise((resolve) => {
    console.log(`\n=== Running ${testFile} ===\n`);
    
    const testPath = path.join(__dirname, testFile);
    const electron = process.platform === 'win32' ? 'electron.cmd' : 'electron';
    const child = spawn(electron, [testPath], { stdio: 'inherit' });
    
    child.on('close', (code) => {
      const passed = code === 0;
      if (passed) {
        results.passed++;
        console.log(`\n✓ ${testFile} passed\n`);
      } else {
        results.failed++;
        results.failures.push(testFile);
        console.log(`\n✗ ${testFile} failed\n`);
      }
      resolve(passed);
    });
  });
}

// Run all tests sequentially
async function runAllTests() {
  console.log('=== Bicep Blockly Editor Test Suite ===\n');
  
  for (const testFile of testFiles) {
    await runTest(testFile);
  }
  
  // Print summary
  console.log('\n=== Test Summary ===');
  console.log(`Total: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  if (results.failed > 0) {
    console.log('\nFailed tests:');
    results.failures.forEach(failure => {
      console.log(`- ${failure}`);
    });
    process.exit(1);
  } else {
    console.log('\nAll tests passed!');
    process.exit(0);
  }
}

// Run the tests
runAllTests();
