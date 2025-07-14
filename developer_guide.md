# Bicep Blockly Editor - Developer Guide

## Introduction

This developer guide provides technical information for developers who want to understand, modify, or extend the Bicep Blockly Editor. It covers the architecture, key components, and implementation details of the application.

## Architecture Overview

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

### Main Process Components

- **Main Application (main.ts)**: Entry point and window management
- **Git Module Analyzer (git-module-analyzer.ts)**: Analyzes Bicep modules from git repositories
- **Feature Flag Manager (feature-flag-manager.ts)**: Manages environment-specific configurations
- **Bicep File Manager (bicep-file-manager.ts)**: Handles file operations for Bicep files
- **Preload Script (preload.ts)**: Exposes APIs to the renderer process

### Renderer Process Components

- **Bicep Blockly Editor (bicep-blockly-editor.ts)**: Main editor component
- **Bicep Blocks (bicep-blocks.ts)**: Defines Bicep block types
- **Bicep Generator (bicep-generator.ts)**: Generates Bicep code from blocks
- **Feature Flag Blocks (feature-flag-blocks.ts)**: Manages feature flag blocks

### Common Components

- **Types (types.ts)**: Shared type definitions

## Development Environment Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git

### Setting Up the Development Environment

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

## Key Components in Detail

### Git Module Analyzer

The Git Module Analyzer is responsible for:

- Cloning git repositories containing Bicep modules
- Analyzing Bicep module files to extract parameters, outputs, and resources
- Generating metadata for module representation
- Providing module information to the renderer process

Key methods:
- `cloneRepository(repo)`: Clones a git repository
- `scanForModules(repo)`: Scans a repository for Bicep modules
- `analyzeBicepModule(filePath, repo)`: Analyzes a Bicep module file

### Bicep Block Factory

The Bicep Block Factory creates block definitions for:

- Core Azure resources (storage accounts, virtual networks, etc.)
- Bicep modules from git repositories
- Feature flags and conditional deployments

Key methods:
- `createCoreBlocks()`: Creates blocks for core Azure resources
- `createModuleBlockDefinition(moduleMetadata)`: Creates a block definition for a Bicep module
- `registerModuleBlock(blockDef)`: Registers a module block with Blockly

### Bicep Generator

The Bicep Generator converts Blockly blocks to Bicep code:

- Generates Bicep code for core resource blocks
- Generates module references with parameters
- Handles feature flag integration
- Manages conditional deployments

Key methods:
- `defineBlockGenerators(generator)`: Defines code generators for each block type
- `generateCode()`: Generates Bicep code from the workspace

### Feature Flag Manager

The Feature Flag Manager handles environment-specific configurations:

- Manages environment profiles (development, testing, staging, production)
- Stores feature flag values for each environment
- Provides feature flag values to the renderer process

Key methods:
- `getFeatureFlags(environment)`: Gets feature flags for an environment
- `getFeatureFlagValue(environment, flagName)`: Gets a specific feature flag value

## Extending the Editor

### Adding New Block Types

To add a new block type:

1. Define the block in `bicep-blocks.ts`:
   ```typescript
   Blockly.common.defineBlocksWithJsonArray([{
     "type": "bicep_new_resource",
     "message0": "New Resource %1",
     "args0": [
       {
         "type": "field_input",
         "name": "NAME",
         "text": "newResource"
       }
     ],
     // Additional block definition...
   }]);
   ```

2. Add a code generator in `bicep-generator.ts`:
   ```typescript
   generator.forBlock['bicep_new_resource'] = function(block) {
     const name = block.getFieldValue('NAME');
     // Generate Bicep code...
     return code;
   };
   ```

3. Add the block to the toolbox in `bicep-blockly-editor.ts`.

### Adding New Feature Flag Types

To add a new feature flag type:

1. Extend the `FeatureFlag` interface in `types.ts` if needed.

2. Update the `createFeatureFlagBlockDefinition` method in `feature-flag-blocks.ts`.

3. Update the feature flag code generator in `feature-flag-blocks.ts`.

### Implementing Bicep to Block Conversion

To implement conversion from Bicep code to blocks:

1. Create a Bicep parser that can extract resource definitions, modules, and parameters.

2. Map Bicep elements to corresponding block types.

3. Create blocks in the workspace based on the parsed Bicep code.

## IPC Communication

The application uses Electron's IPC (Inter-Process Communication) for communication between main and renderer processes:

### Main to Renderer

- `module-analyzed`: Notifies when a module has been analyzed
- `repository-updated`: Notifies when a repository has been updated
- `bicep-compiled`: Notifies when Bicep code has been compiled

### Renderer to Main

- `git-add-repository`: Adds a git repository
- `git-refresh-repository`: Refreshes a git repository
- `module-analyze`: Analyzes a Bicep module
- `feature-flags-load`: Loads feature flags for an environment
- `file-open-bicep`: Opens a Bicep file
- `file-save-bicep`: Saves a Bicep file

## Building and Packaging

### Building for Development

```
npm run build
```

This compiles TypeScript files and bundles them with webpack.

### Running in Development Mode

```
npm run dev
```

This builds the application and starts it with Electron.

### Packaging for Distribution

```
npm run package
```

This creates distributable packages for Windows, macOS, and Linux using electron-builder.

## Testing

### Running Tests

```
npm test
```

This runs the test suite using Jest.

### Adding Tests

Add test files in the `__tests__` directory with the `.test.ts` extension.

## Troubleshooting Development Issues

### Common Issues

- **Module resolution errors**: Check import paths and tsconfig.json
- **Blockly workspace not rendering**: Check DOM element IDs and CSS
- **IPC communication failures**: Verify channel names and parameter types

### Debugging

- Use `console.log` in the renderer process
- Use `console.error` in the main process
- Check the DevTools console (open with Ctrl+Shift+I)

## Contributing

### Code Style

- Follow TypeScript best practices
- Use consistent naming conventions
- Document public methods and interfaces

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Conclusion

This developer guide provides an overview of the Bicep Blockly Editor's architecture and implementation details. By understanding these components, developers can effectively modify and extend the editor to meet their specific needs.
