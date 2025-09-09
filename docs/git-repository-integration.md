# Git Repository Toolbox Integration

The Bicep Blockly Editor includes powerful git repository integration that allows you to dynamically load Bicep modules from external repositories into your toolbox.

## Features

### Repository Management
- **Add repositories**: Connect to public or private git repositories containing Bicep modules
- **Authentication support**: Support for Personal Access Tokens (PAT) and SSH keys
- **Branch selection**: Choose specific branches to work with
- **Auto-refresh**: Automatically pull latest changes from repositories

### Module Discovery
- **Automatic scanning**: Recursively scans repositories for `.bicep` files
- **Metadata extraction**: Analyzes modules to extract parameters, outputs, and resources
- **Toolbox integration**: Automatically adds discovered modules to the Blockly toolbox

### Cross-Platform Support
- **Line ending normalization**: Handles CRLF/LF differences across Windows/Unix systems
- **Path resolution**: Consistent path handling across operating systems
- **Git configuration**: Proper git setup for each platform

## Usage

### Adding a Repository

```javascript
// Add a public repository
await window.api.invoke('git-add-repository', {
  url: 'https://github.com/Azure/bicep-types-az.git',
  branch: 'main'
});

// Add a private repository with PAT authentication
await window.api.invoke('git-add-repository', {
  url: 'https://github.com/your-org/bicep-modules.git',
  branch: 'main',
  auth: {
    type: 'pat',
    token: 'your-personal-access-token'
  }
});
```

### Refreshing Repository Content

```javascript
// Refresh a specific repository
await window.api.invoke('git-refresh-repository', 'repository-id');
```

### Listing Available Modules

```javascript
// Get all modules from a repository
const modules = await window.api.invoke('module-list', 'repository-id');
```

### Analyzing Module Details

```javascript
// Get detailed information about a specific module
const moduleInfo = await window.api.invoke('module-analyze', '/path/to/module.bicep');
```

## Repository Structure

For optimal integration, organize your Bicep repository as follows:

```
bicep-modules/
├── modules/
│   ├── storage/
│   │   ├── storage-account.bicep
│   │   └── blob-container.bicep
│   ├── compute/
│   │   ├── virtual-machine.bicep
│   │   └── app-service.bicep
│   └── networking/
│       ├── virtual-network.bicep
│       └── network-security-group.bicep
├── examples/
│   └── complete-solution.bicep
└── README.md
```

## Module Format

Bicep modules should follow this format for best integration:

```bicep
// Description of what this module does
// This description will be extracted and shown in the toolbox

@description('The location where resources will be deployed')
param location string = resourceGroup().location

@description('The name of the storage account')
param storageAccountName string

@description('The SKU of the storage account')
@allowed(['Standard_LRS', 'Standard_GRS', 'Premium_LRS'])
param sku string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: sku
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

@description('The resource ID of the storage account')
output storageAccountId string = storageAccount.id

@description('The primary endpoints of the storage account')
output primaryEndpoints object = storageAccount.properties.primaryEndpoints
```

## Security Considerations

- **Token storage**: PAT tokens are stored securely in the application's configuration
- **Repository validation**: URLs and authentication are validated before repository access
- **Sandboxed execution**: Module analysis runs in a secure environment
- **Cache management**: Repository caches are automatically cleaned up

## Troubleshooting

### Common Issues

1. **Authentication failures**
   - Verify PAT token has correct permissions
   - Check repository URL format
   - Ensure SSH keys are properly configured

2. **Module not detected**
   - Verify `.bicep` file extension
   - Check file is in configured repository paths
   - Ensure proper Bicep syntax

3. **Cross-platform path issues**
   - Repository uses consistent line endings (LF)
   - Paths use forward slashes
   - No special characters in filenames

### Configuration Files

The integration respects the following configuration files:

- **`.gitattributes`**: For line ending normalization
- **`.editorconfig`**: For consistent code formatting
- **`.gitignore`**: For excluding unnecessary files from analysis

## API Reference

### IPC Handlers

- `git-add-repository`: Add a new repository
- `git-refresh-repository`: Refresh repository content
- `git-list-repositories`: List all configured repositories
- `module-list`: List modules from a repository
- `module-analyze`: Get detailed module information

### Data Structures

```typescript
interface RepositoryConfig {
  id: string;
  name: string;
  url: string;
  branch: string;
  auth: AuthConfig;
  paths: string[];
  refresh: RefreshConfig;
}

interface ModuleMetadata {
  moduleName: string;
  moduleSource: string;
  modulePath: string;
  description?: string;
  parameters: Parameter[];
  outputs: Output[];
  resources: Resource[];
  lastUpdated: string;
}
```

This integration makes it easy to maintain a centralized collection of Bicep modules that can be shared across teams and projects while providing a seamless visual editing experience in the Blockly editor.