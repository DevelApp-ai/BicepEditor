const path = require('path');
const fs = require('fs');
const packageJson = require('../package.json');

// Create a simple installer script for the Bicep Blockly Editor
console.log(`
===============================================
Bicep Blockly Editor Installer Helper v${packageJson.version}
===============================================

This script helps prepare the Bicep Blockly Editor for packaging.

1. Checking directory structure...
`);

// Check and create necessary directories
const directories = [
  'dist',
  'assets',
  'assets/icons',
  'assets/icons/mac',
  'assets/icons/win',
  'assets/icons/png'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dirPath, { recursive: true });
  } else {
    console.log(`Directory exists: ${dir}`);
  }
});

console.log(`
2. Creating placeholder icons...
`);

// Create placeholder icons for each platform
// In a real project, these would be actual icons
function createPlaceholderIcon(filePath, size) {
  console.log(`Creating placeholder icon: ${filePath}`);
  
  // Create a simple text file as a placeholder
  // In a real project, this would create actual icon files
  fs.writeFileSync(
    filePath, 
    `This is a placeholder for an icon file of size ${size}x${size}.
In a real project, this would be an actual icon file.`
  );
}

// Windows icon
createPlaceholderIcon(path.join(__dirname, '../assets/icons/win/icon.ico'), 256);

// macOS icon
createPlaceholderIcon(path.join(__dirname, '../assets/icons/mac/icon.icns'), 1024);

// PNG icons for Linux (multiple sizes)
[16, 32, 48, 64, 128, 256, 512].forEach(size => {
  createPlaceholderIcon(
    path.join(__dirname, `../assets/icons/png/${size}x${size}.png`), 
    size
  );
});

console.log(`
3. Checking package.json configuration...
`);

// Verify package.json has required fields
const requiredFields = ['name', 'version', 'description', 'main', 'author', 'license'];
const missingFields = requiredFields.filter(field => !packageJson[field]);

if (missingFields.length > 0) {
  console.log(`Warning: Missing required fields in package.json: ${missingFields.join(', ')}`);
} else {
  console.log('All required fields present in package.json');
}

// Check build configuration
if (!packageJson.build) {
  console.log('Warning: No build configuration found in package.json');
} else {
  console.log('Build configuration found in package.json');
  
  // Check platform-specific configurations
  ['mac', 'win', 'linux'].forEach(platform => {
    if (!packageJson.build[platform]) {
      console.log(`Warning: No ${platform} configuration found in build settings`);
    } else {
      console.log(`${platform} configuration found in build settings`);
    }
  });
}

console.log(`
4. Checking for required files...
`);

// Check for required files
const requiredFiles = [
  'index.html',
  'styles.css',
  'package.json',
  'README.md',
  'docs/user_guide.md',
  'docs/developer_guide.md',
  'docs/installation_guide.md'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, '..', file)));

if (missingFiles.length > 0) {
  console.log(`Warning: Missing required files: ${missingFiles.join(', ')}`);
} else {
  console.log('All required files present');
}

console.log(`
5. Generating version information...
`);

// Generate version information file
const versionInfo = {
  version: packageJson.version,
  buildDate: new Date().toISOString(),
  platform: process.platform,
  arch: process.arch,
  nodeVersion: process.version,
  electronVersion: process.versions.electron || 'unknown'
};

fs.writeFileSync(
  path.join(__dirname, '../dist/version-info.json'),
  JSON.stringify(versionInfo, null, 2)
);

console.log(`Version information written to dist/version-info.json`);

console.log(`
===============================================
Installation preparation complete!

To build the application:
  npm run build

To package the application:
  npm run package        # All platforms
  npm run package:win    # Windows only
  npm run package:mac    # macOS only
  npm run package:linux  # Linux only
===============================================
`);
