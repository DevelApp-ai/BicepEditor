# Bicep Blockly Editor UI Design

## Overview

This document outlines the user interface design for the Bicep Blockly Editor, focusing on the visual representation of Bicep modules as Blockly blocks and the overall user experience.

## Main Application Window

The main application window is divided into several key areas:

```
┌─────────────────────────────────────────────────────────────┐
│ Menu Bar                                                    │
├─────────────┬───────────────────────────┬───────────────────┤
│             │                           │                   │
│  Module     │                           │  Properties       │
│  Toolbox    │     Blockly Workspace     │  Panel            │
│             │                           │                   │
│             │                           │                   │
│             │                           │                   │
├─────────────┴───────────────────────────┴───────────────────┤
│ Code Preview / Console                                      │
└─────────────────────────────────────────────────────────────┘
```

### Menu Bar

The menu bar provides access to application functions:

- **File**: New, Open, Save, Export, Settings
- **Edit**: Undo, Redo, Copy, Paste, Delete
- **View**: Zoom, Grid, Toolbox visibility
- **Git**: Repository management, Pull, Refresh
- **Environment**: Environment selection, Feature flag management
- **Deploy**: Validate, Deploy to Azure
- **Help**: Documentation, About

### Module Toolbox

The module toolbox displays available Bicep modules organized into categories:

- **Core Resources**: Basic Azure resources
- **Repositories**: Modules from connected git repositories
- **Recent**: Recently used modules
- **Favorites**: User-marked favorite modules
- **Search**: Module search functionality

Each module is represented by an icon and name, with additional metadata available on hover.

### Blockly Workspace

The Blockly workspace is the main editing area where users:

- Drag and drop modules from the toolbox
- Connect modules to create dependencies
- Configure module parameters
- Apply feature flags to modules or parameters

The workspace supports:
- Zooming and panning
- Block grouping
- Collapse/expand blocks
- Comments and annotations

### Properties Panel

The properties panel displays details of the currently selected module:

- **Module Info**: Name, description, source repository
- **Parameters**: List of parameters with type information and input fields
- **Outputs**: List of outputs with type information
- **Feature Flags**: Environment-specific configurations
- **Documentation**: Links to module documentation

### Code Preview / Console

The bottom panel can toggle between:

- **Code Preview**: Shows the generated Bicep code with syntax highlighting
- **Console**: Displays logs, errors, and deployment status
- **Diff View**: Shows changes between versions

## Module Block Design

### Basic Module Block

```
┌─────────────────────────────────────────────┐
│ Module: storageAccount                      │
├─────────────────────────────────────────────┤
│ Parameters:                                 │
│   ┌───────────────┐                         │
│   │ name: String  │                         │
│   └───────────────┘                         │
│   ┌───────────────┐                         │
│   │ sku: String   │                         │
│   └───────────────┘                         │
├─────────────────────────────────────────────┤
│ Outputs:                                    │
│   ┌───────────────┐                         │
│   │ id: String    │                         │
│   └───────────────┘                         │
│   ┌───────────────┐                         │
│   │ endpoint: URL │                         │
│   └───────────────┘                         │
└─────────────────────────────────────────────┘
```

Each module block includes:

1. **Header**: Module name and source indicator
2. **Parameters Section**: Input fields for each parameter
3. **Outputs Section**: Connection points for module outputs
4. **Feature Flag Indicators**: Visual indicators for environment-specific settings

### Parameter Types

Parameters are visually distinguished by type:

- **String**: Text input field
- **Number**: Numeric input field
- **Boolean**: Toggle switch
- **Object**: Expandable object editor
- **Array**: List editor with add/remove buttons
- **Resource Reference**: Connection point for other module outputs

### Feature Flag Visualization

Feature flags are indicated through:

- **Color Coding**: Different colors for different environments
- **Icons**: Visual indicators for flag types
- **Highlighting**: Active flags are highlighted

## Git Repository Management

### Repository Connection Dialog

```
┌─────────────────────────────────────────────────────────────┐
│ Connect Git Repository                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Repository URL: [https://github.com/example/bicep-modules] │
│                                                             │
│  Branch/Tag: [main]                                         │
│                                                             │
│  Authentication:                                            │
│    ○ None                                                   │
│    ● Personal Access Token                                  │
│    ○ SSH Key                                                │
│                                                             │
│  Token: [••••••••••••••••]                                  │
│                                                             │
│  Module Path: [/modules]                                    │
│                                                             │
│  Auto-refresh: [✓] Every [30] minutes                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Cancel]                                [Test] [Connect]   │
└─────────────────────────────────────────────────────────────┘
```

### Repository Manager

The repository manager shows:

- List of connected repositories
- Status (connected, error, updating)
- Last update time
- Number of available modules
- Actions (refresh, edit, remove)

## Feature Flag Management

### Environment Selector

```
┌─────────────────────────┐
│ Environment: [Production▼]│
└─────────────────────────┘
```

Dropdown menu with options:
- Development
- Testing
- Staging
- Production
- Custom environments

### Feature Flag Editor

```
┌─────────────────────────────────────────────────────────────┐
│ Feature Flags - Production                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✓ Enable High Availability                                 │
│    └─ Replica Count: [3]                                    │
│                                                             │
│  ✓ Enable Geo-Redundancy                                    │
│    └─ Regions: [East US, West US, Central US]               │
│                                                             │
│  ✗ Enable Advanced Monitoring                               │
│                                                             │
│  ✓ Storage Tier: [Premium]                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Cancel]                                        [Save]     │
└─────────────────────────────────────────────────────────────┘
```

### Environment Comparison

A side-by-side view showing differences between environments:

```
┌─────────────────────────┬─────────────────────────┐
│ Development             │ Production              │
├─────────────────────────┼─────────────────────────┤
│ ✓ High Availability     │ ✓ High Availability     │
│   └─ Replicas: 2        │   └─ Replicas: 3        │
├─────────────────────────┼─────────────────────────┤
│ ✗ Geo-Redundancy        │ ✓ Geo-Redundancy        │
│                         │   └─ Regions: 3         │
├─────────────────────────┼─────────────────────────┤
│ ✓ Advanced Monitoring   │ ✗ Advanced Monitoring   │
├─────────────────────────┼─────────────────────────┤
│ ✓ Storage: Standard     │ ✓ Storage: Premium      │
└─────────────────────────┴─────────────────────────┘
```

## Module Analysis Visualization

### Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│ Module Dependencies                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌───────────┐         ┌───────────┐                      │
│    │ Network   │────────>│ Subnet    │                      │
│    └───────────┘         └───────────┘                      │
│         │                      │                            │
│         │                      │                            │
│         │                      ▼                            │
│         │               ┌───────────┐                       │
│         └──────────────>│ VM        │                       │
│                         └───────────┘                       │
│                              │                              │
│                              │                              │
│                              ▼                              │
│                        ┌───────────┐                        │
│                        │ Storage   │                        │
│                        └───────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Module Input/Output Analysis

```
┌─────────────────────────────────────────────────────────────┐
│ Module: VM                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Inputs:                                                     │
│  ┌─────────────────┬─────────┬───────────┬─────────────────┐│
│  │ Name            │ Type    │ Required  │ Default         ││
│  ├─────────────────┼─────────┼───────────┼─────────────────┤│
│  │ vmName          │ string  │ Yes       │ -               ││
│  │ subnetId        │ string  │ Yes       │ -               ││
│  │ vmSize          │ string  │ No        │ 'Standard_D2s_v3'││
│  │ adminUsername   │ string  │ No        │ 'azureuser'     ││
│  └─────────────────┴─────────┴───────────┴─────────────────┘│
│                                                             │
│ Outputs:                                                    │
│  ┌─────────────────┬─────────┬───────────────────────────┐  │
│  │ Name            │ Type    │ Description               │  │
│  ├─────────────────┼─────────┼───────────────────────────┤  │
│  │ vmId            │ string  │ Resource ID of the VM     │  │
│  │ privateIp       │ string  │ Private IP address        │  │
│  │ publicIp        │ string  │ Public IP address (if any)│  │
│  └─────────────────┴─────────┴───────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Design

The UI is designed to be responsive with:

- Collapsible panels
- Resizable workspace
- Adjustable font sizes
- High contrast mode
- Touch-friendly controls for tablet use

## Accessibility Features

The editor includes accessibility features:

- Keyboard navigation
- Screen reader support
- Color contrast options
- Text-to-speech for error messages
- Customizable shortcuts

## Theme Support

The editor supports multiple themes:

- Light theme
- Dark theme
- High contrast theme
- Custom themes

## Conclusion

This UI design provides a comprehensive and intuitive interface for working with Bicep modules in a visual programming environment. The design focuses on making module inputs and outputs clearly visible and easily configurable, while providing powerful tools for git integration and feature flag management.
