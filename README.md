# Bicep Blockly Editor - README

## Overview

The Bicep Blockly Editor is a visual programming environment for creating and managing Azure Bicep templates. It leverages Google's Blockly framework to provide a drag-and-drop interface for working with Bicep modules, with a focus on analyzing module inputs and outputs. The application is built as an Electron app for cross-platform compatibility on Windows, Linux, and macOS.

## Key Features

- **Visual Bicep Editing**: Create Bicep templates using a drag-and-drop interface
- **Module Analysis**: Analyze Bicep modules from git repositories to extract inputs and outputs
- **Git Integration**: Pull in modules from git repositories as blocks
- **Feature Flags**: Configure different environments with environment-specific settings
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Getting Started

### Installation

Download the appropriate installer for your platform from the releases page:

- **Windows**: `BicepBlocklyEditor-Setup-x.x.x.exe`
- **macOS**: `BicepBlocklyEditor-x.x.x.dmg`
- **Linux**: `BicepBlocklyEditor-x.x.x.AppImage`

For detailed installation instructions, see the [Installation Guide](docs/installation_guide.md).

### Documentation

- [User Guide](docs/user_guide.md): Learn how to use the Bicep Blockly Editor
- [Developer Guide](docs/developer_guide.md): Technical information for developers
- [Installation Guide](docs/installation_guide.md): Platform-specific installation instructions

## Development

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/example/bicep-blockly-editor.git
   cd bicep-blockly-editor
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the application:
   ```
   npm run build
   ```

4. Start the application in development mode:
   ```
   npm run dev
   ```

### Testing

Run all tests:
```
npm test
```

Run specific test suites:
```
npm run test:core      # Core functionality tests
npm run test:modules   # Module analysis tests
npm run test:flags     # Feature flag tests
npm run test:platform  # Cross-platform tests
```

### Packaging

Build packages for all platforms:
```
npm run package
```

Build for specific platforms:
```
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

## Architecture

The Bicep Blockly Editor follows a standard Electron application architecture with main and renderer processes:

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Application                     │
├─────────────┬───────────────────────────┬───────────────────┤
│             │                           │                   │
│  Git Module │     Blockly Editor        │  Bicep Compiler   │
│  Analyzer   │                           │  Integration      │
│             │                           │                   │
├─────────────┼───────────────────────────┼───────────────────┤
│             │                           │                   │
│  Module     │     Feature Flag          │  Code Generator   │
│  Repository │     Manager               │                   │
│             │                           │                   │
└─────────────┴───────────────────────────┴───────────────────┘
```

For more details, see the [Developer Guide](docs/developer_guide.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
