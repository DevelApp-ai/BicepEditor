# Bicep Blockly Editor - User Guide

## Introduction

The Bicep Blockly Editor is a visual programming environment for creating and managing Azure Bicep templates. It leverages Google's Blockly framework to provide a drag-and-drop interface for working with Bicep modules, with a focus on analyzing module inputs and outputs. The application is built as an Electron app for cross-platform compatibility on Windows, Linux, and macOS.

This guide will help you understand how to use the Bicep Blockly Editor to create infrastructure as code using visual blocks, with a special focus on modules as integration points and feature flags for environment-specific configurations.

## Getting Started

### Installation

1. Download the appropriate installer for your operating system:
   - Windows: `BicepBlocklyEditor-Setup-x.x.x.exe`
   - macOS: `BicepBlocklyEditor-x.x.x.dmg`
   - Linux: `BicepBlocklyEditor-x.x.x.AppImage`

2. Run the installer and follow the on-screen instructions.

3. Launch the Bicep Blockly Editor from your applications menu or desktop shortcut.

### User Interface Overview

The Bicep Blockly Editor interface is divided into several key areas:

- **Toolbar**: Contains buttons for file operations and environment selection
- **Module Toolbox**: Lists available Bicep modules and resources
- **Blockly Workspace**: Main editing area for arranging and connecting blocks
- **Properties Panel**: Shows details and settings for the selected block
- **Code Preview / Console**: Shows the generated Bicep code or console output

## Working with Bicep Blocks

### Core Resource Blocks

The editor provides blocks for common Azure resources:

- **Storage Account**: Create Azure Storage accounts
- **Virtual Network**: Create Azure Virtual Networks
- **Conditional Deployment**: Deploy resources based on conditions

To use a resource block:

1. Drag the block from the "Core Resources" category in the toolbox
2. Fill in the required parameters
3. Connect it to other blocks as needed

### Module Blocks

Module blocks represent Bicep modules from git repositories:

1. To add a module repository:
   - Click on the "Git" menu
   - Select "Add Repository"
   - Enter the repository URL, branch, and authentication details

2. Once added, module blocks will appear in the "Modules" category in the toolbox

3. To use a module block:
   - Drag the module block from the toolbox
   - Configure its parameters
   - Use its outputs as inputs to other blocks

### Feature Flag Blocks

Feature flags allow you to create environment-specific configurations:

1. Select an environment from the dropdown in the toolbar

2. Feature flag blocks will appear in the "Feature Flags" category

3. To use a feature flag:
   - Drag the feature flag block from the toolbox
   - Connect it to conditional deployment blocks or use as parameter values

## Environment Configuration

The Bicep Blockly Editor supports multiple environments:

- **Development**: For local development
- **Testing**: For test environments
- **Staging**: For pre-production
- **Production**: For production deployments

To switch environments:

1. Select the desired environment from the dropdown in the toolbar
2. The editor will update feature flag values based on the selected environment
3. The code preview will show the environment-specific Bicep code

## Git Repository Integration

The editor can analyze Bicep modules from git repositories:

### Adding a Repository

1. Click on the "Git" menu
2. Select "Add Repository"
3. Enter the repository URL (e.g., `https://github.com/example/bicep-modules`)
4. Specify the branch (e.g., `main`)
5. Configure authentication if required
6. Click "Connect"

### Managing Repositories

1. Click on the "Git" menu
2. Select "Manage Repositories"
3. From here you can:
   - Refresh repositories to get the latest modules
   - Edit repository settings
   - Remove repositories

## File Operations

### Creating a New File

1. Click the "New" button in the toolbar
2. The workspace will be cleared for a new Bicep template

### Opening a File

1. Click the "Open" button in the toolbar
2. Select a Bicep file (.bicep) from your file system
3. The editor will attempt to convert the Bicep code to blocks

### Saving a File

1. Click the "Save" button in the toolbar
2. If this is a new file, you'll be prompted to choose a location and filename
3. The editor will save the generated Bicep code to the specified file

## Module Analysis

The editor analyzes Bicep modules to extract:

- **Parameters**: Input values required by the module
- **Outputs**: Values produced by the module that can be used elsewhere
- **Resources**: Azure resources created by the module

This analysis is used to create block representations with appropriate inputs and outputs.

## Feature Flag System

Feature flags allow you to configure different environments:

### Predefined Flags

The editor comes with several predefined feature flags:

- **enableHighAvailability**: Enables high availability features
- **replicaCount**: Number of replicas to deploy
- **enableGeoRedundancy**: Enables geo-redundant storage
- **storageTier**: Storage tier to use (Standard/Premium)

### Custom Flags

You can create custom feature flags:

1. Click on the "Environment" menu
2. Select "Manage Feature Flags"
3. Click "Add Flag"
4. Configure the flag name, type, and values for each environment

## Best Practices

### Module Organization

- Group related resources into modules
- Use clear, descriptive names for modules
- Document module inputs and outputs

### Feature Flag Usage

- Use feature flags for environment-specific settings
- Keep feature flag names consistent
- Document the purpose of each feature flag

### Git Repository Structure

- Organize modules into logical directories
- Use consistent naming conventions
- Include documentation for each module

## Troubleshooting

### Common Issues

- **Module not appearing in toolbox**: Refresh the repository or check for syntax errors in the module
- **Feature flag not working**: Verify the environment selection and flag configuration
- **Code generation errors**: Check for missing required parameters or invalid connections

### Getting Help

- Check the console output for error messages
- Refer to the documentation
- Visit the project repository for issues and updates

## Conclusion

The Bicep Blockly Editor provides a visual approach to creating Azure infrastructure as code, with a focus on modules as integration points and feature flags for environment-specific configurations. By following this guide, you should be able to effectively use the editor to create, manage, and deploy Bicep templates.
