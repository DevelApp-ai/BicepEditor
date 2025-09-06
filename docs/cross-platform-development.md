# Cross-Platform Development Guide

This guide outlines best practices for developing the Bicep Blockly Editor across different platforms (Windows, macOS, Linux).

## Line Ending Handling

### Automatic Configuration
The project includes `.gitattributes` to automatically handle line endings:
- All text files use LF line endings in the repository
- Git automatically converts line endings on checkout/commit based on platform
- Binary files are properly identified to prevent corruption

### Developer Setup

#### Windows Developers
```bash
# Configure Git to use LF line endings
git config --global core.autocrlf false
git config --global core.eol lf

# Verify configuration
git config --get core.autocrlf  # Should return: false
git config --get core.eol       # Should return: lf
```

#### macOS/Linux Developers
```bash
# Usually no configuration needed, but verify:
git config --global core.autocrlf input
git config --global core.eol lf
```

## Editor Configuration

The project includes `.editorconfig` which is supported by most modern editors:

- **VS Code**: Install the EditorConfig extension
- **JetBrains IDEs**: Built-in support
- **Sublime Text**: Install EditorConfig package
- **Vim/Neovim**: Install editorconfig-vim plugin

## Code Quality Tools

### ESLint
Enforces consistent code style and catches common errors:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Prettier
Ensures consistent code formatting:

```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format
```

### TypeScript
Provides type checking:

```bash
# Type check only
npm run type-check

# Type check with linting
npm run lint
```

## Platform-Specific Considerations

### Windows
- **Path separators**: Use `path.join()` or `path.resolve()` instead of hardcoded slashes
- **Case sensitivity**: Be aware that Windows filesystem is case-insensitive
- **Maximum path length**: Consider long path limitations (260 characters)
- **PowerShell vs CMD**: CI/CD pipeline uses bash for consistency

### macOS
- **File permissions**: Executable permissions for scripts
- **Notarization**: Required for distribution outside App Store
- **Code signing**: Required for macOS builds

### Linux
- **Display server**: X11/Wayland compatibility for Electron
- **Package formats**: Support for AppImage, deb, rpm
- **Dependencies**: System library requirements

## Build System

### Webpack Configuration
The build system is configured to work consistently across platforms:

```javascript
// webpack.config.js handles platform differences
const path = require('path');

module.exports = {
  // Use path.resolve for cross-platform compatibility
  entry: path.resolve(__dirname, 'src/renderer/renderer.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
};
```

### Electron Builder
Platform-specific packaging is handled by electron-builder:

```json
{
  "mac": {
    "category": "public.app-category.developer-tools",
    "target": ["dmg", "zip"]
  },
  "win": {
    "target": ["nsis", "portable"]
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm"]
  }
}
```

## Testing Across Platforms

### CI/CD Pipeline
The CI/CD pipeline tests on all three major platforms:

- **Ubuntu**: Primary Linux testing
- **Windows**: Windows 10/11 compatibility
- **macOS**: macOS compatibility

### Local Testing

#### Prerequisites
```bash
# Install dependencies
npm ci

# Build application
npm run build

# Run tests
npm test
```

#### Platform-Specific Tests
```bash
# Test cross-platform path handling
npm run test:platform

# Test module analysis across platforms
npm run test:modules
```

## File System Operations

### Path Handling
Always use Node.js path utilities:

```typescript
import * as path from 'path';

// Good
const modulePath = path.join(repoPath, 'modules', 'storage.bicep');

// Bad
const modulePath = repoPath + '/modules/storage.bicep';
```

### File Operations
Handle file operations with proper error handling:

```typescript
import * as fs from 'fs/promises';

try {
  const content = await fs.readFile(filePath, 'utf8');
  // Process content
} catch (error) {
  if (error.code === 'ENOENT') {
    // File doesn't exist - handle gracefully
  } else {
    // Other errors
    throw error;
  }
}
```

## Environment Variables

### Development
Set up environment variables for different platforms:

```bash
# Windows (PowerShell)
$env:NODE_ENV = "development"

# Windows (Command Prompt)
set NODE_ENV=development

# macOS/Linux
export NODE_ENV=development
```

### CI/CD
Environment variables are set consistently in the CI/CD pipeline:

```yaml
env:
  NODE_VERSION: '18'
  CI: true
```

## Package Scripts

Cross-platform compatible npm scripts:

```json
{
  "scripts": {
    "clean": "rimraf dist",          // Instead of "rm -rf dist"
    "copy": "copyfiles src/**/*.html dist",  // Instead of "cp"
    "start": "cross-env NODE_ENV=development electron ."
  }
}
```

## Troubleshooting

### Common Issues

#### Line Ending Problems
```bash
# Check for CRLF files
find src -name "*.ts" | xargs file | grep CRLF

# Convert CRLF to LF
find src -name "*.ts" -exec dos2unix {} \;
```

#### Path Separator Issues
```bash
# Check for hardcoded backslashes
grep -r "\\\\" src/ --include="*.ts"
```

#### Permission Issues (Unix)
```bash
# Fix script permissions
chmod +x scripts/*.sh
```

### Development Tools

#### VS Code Configuration
Add to `.vscode/settings.json`:

```json
{
  "files.eol": "\n",
  "editor.insertFinalNewline": true,
  "editor.trimAutoWhitespace": true,
  "typescript.preferences.includePackageJsonAutoImports": "off"
}
```

#### Git Hooks
Consider adding pre-commit hooks:

```bash
# Install husky for git hooks
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run format:check"
```

## Best Practices

1. **Always test on multiple platforms** before merging
2. **Use cross-platform libraries** when possible
3. **Handle file paths correctly** with path utilities
4. **Respect platform conventions** for packaging and distribution
5. **Document platform-specific requirements** clearly
6. **Use consistent line endings** throughout the project
7. **Test git repository integration** with different repository structures

This guide ensures that the Bicep Blockly Editor works consistently across all supported platforms while maintaining high code quality and developer productivity.