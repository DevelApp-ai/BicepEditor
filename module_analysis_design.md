# Bicep Module Analysis and Integration Design

## Overview

This document details the design for analyzing Bicep modules from git repositories and integrating them as blocks in the Blockly editor. It focuses on the technical approach for extracting module inputs and outputs, representing them as visual blocks, and enabling their use as integration points in Bicep templates.

## Module Analysis Process

### Repository Scanning

The module analysis process begins with scanning git repositories for Bicep modules:

1. **Repository Connection**:
   - Clone repository to local cache
   - Authenticate if required (PAT, SSH key)
   - Checkout specified branch or tag

2. **Module Discovery**:
   - Scan repository for `.bicep` files
   - Filter by specified paths
   - Identify module files vs. main template files
   - Create module inventory with metadata

3. **Update Management**:
   - Track repository changes
   - Implement periodic or manual refresh
   - Handle version changes

### Module Parsing

Once modules are discovered, they are parsed to extract their structure:

1. **Parameter Extraction**:
   - Identify `param` declarations
   - Extract name, type, default value, and decorators
   - Determine required vs. optional status
   - Parse parameter constraints (allowed values, min/max)

2. **Output Extraction**:
   - Identify `output` declarations
   - Extract name, type, and value expression
   - Determine output purpose from comments or naming

3. **Resource Analysis**:
   - Identify resource declarations
   - Determine resource types and properties
   - Map resource dependencies

4. **Module Dependencies**:
   - Identify nested module references
   - Map input/output relationships
   - Build dependency graph

### Module Metadata Generation

Based on the parsed information, metadata is generated for each module:

```json
{
  "moduleName": "storageAccount",
  "moduleSource": "https://github.com/example/bicep-modules",
  "modulePath": "/storage/storageAccount.bicep",
  "description": "Creates an Azure Storage Account with configurable options",
  "parameters": [
    {
      "name": "storageAccountName",
      "type": "string",
      "required": true,
      "description": "Name of the storage account",
      "constraints": {
        "minLength": 3,
        "maxLength": 24
      }
    },
    {
      "name": "sku",
      "type": "string",
      "required": false,
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_RAGRS",
        "Premium_LRS"
      ],
      "description": "Storage account SKU"
    }
  ],
  "outputs": [
    {
      "name": "storageAccountId",
      "type": "string",
      "description": "Resource ID of the storage account"
    },
    {
      "name": "blobEndpoint",
      "type": "string",
      "description": "Blob storage endpoint URL"
    }
  ],
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01"
    }
  ],
  "version": "1.0.0",
  "lastUpdated": "2025-04-23T12:00:00Z"
}
```

## Block Generation

### Block Definition Creation

For each module, a Blockly block definition is generated:

```javascript
Blockly.common.defineBlocksWithJsonArray([{
  "type": "bicep_module_storageAccount",
  "message0": "Storage Account %1",
  "args0": [
    {
      "type": "field_label",
      "text": "from example/bicep-modules"
    }
  ],
  "message1": "Name: %1",
  "args1": [
    {
      "type": "field_input",
      "name": "MODULE_NAME",
      "text": "storageAccount"
    }
  ],
  "message2": "Storage Account Name: %1",
  "args2": [
    {
      "type": "input_value",
      "name": "PARAM_storageAccountName",
      "check": "String"
    }
  ],
  "message3": "SKU: %1",
  "args3": [
    {
      "type": "field_dropdown",
      "name": "PARAM_sku",
      "options": [
        ["Standard_LRS", "Standard_LRS"],
        ["Standard_GRS", "Standard_GRS"],
        ["Standard_RAGRS", "Standard_RAGRS"],
        ["Premium_LRS", "Premium_LRS"]
      ]
    }
  ],
  "output": "BicepModule",
  "outputConnections": [
    {
      "name": "OUTPUT_storageAccountId",
      "type": "String"
    },
    {
      "name": "OUTPUT_blobEndpoint",
      "type": "String"
    }
  ],
  "colour": 160,
  "tooltip": "Creates an Azure Storage Account with configurable options",
  "helpUrl": "https://github.com/example/bicep-modules/blob/main/storage/storageAccount.bicep"
}]);
```

### Code Generator Creation

For each module block, a code generator function is created:

```javascript
Blockly.BicepGenerator.forBlock['bicep_module_storageAccount'] = function(block) {
  var moduleName = block.getFieldValue('MODULE_NAME');
  var storageAccountName = Blockly.BicepGenerator.valueToCode(block, 'PARAM_storageAccountName', Blockly.BicepGenerator.ORDER_ATOMIC) || '\'defaultStorageName\'';
  var sku = block.getFieldValue('PARAM_sku');
  
  var code = `module ${moduleName} '../storage/storageAccount.bicep' = {\n`;
  code += `  params: {\n`;
  code += `    storageAccountName: ${storageAccountName}\n`;
  code += `    sku: '${sku}'\n`;
  code += `  }\n`;
  code += `}\n`;
  
  return code;
};
```

### Output Connection Handling

To handle module outputs as integration points:

```javascript
// Register module outputs for reference by other blocks
Blockly.BicepGenerator.registerModuleOutput = function(block, outputName, outputType) {
  var moduleName = block.getFieldValue('MODULE_NAME');
  var outputVarName = `${moduleName}.outputs.${outputName}`;
  
  // Store in global registry for reference
  Blockly.BicepGenerator.moduleOutputs[outputVarName] = {
    type: outputType,
    block: block.id
  };
  
  return outputVarName;
};
```

## Module Integration as Blocks

### Toolbox Integration

Modules are organized in the toolbox by repository and category:

```javascript
var toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "Core Resources",
      "contents": [
        // Core resource blocks
      ]
    },
    {
      "kind": "category",
      "name": "example/bicep-modules",
      "contents": [
        {
          "kind": "category",
          "name": "Storage",
          "contents": [
            {
              "kind": "block",
              "type": "bicep_module_storageAccount"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Networking",
          "contents": [
            // Networking module blocks
          ]
        }
      ]
    }
  ]
};
```

### Module Parameter Connections

Parameters can be connected to:

1. **Literal Values**: Direct input of strings, numbers, booleans
2. **Variables**: Reference to Bicep variables
3. **Module Outputs**: Outputs from other modules
4. **Expressions**: Complex Bicep expressions

### Module Output Usage

Module outputs are made available as:

1. **Connection Points**: Visual connectors for other blocks
2. **Reference Blocks**: Blocks that reference specific outputs
3. **Dropdown Options**: Selection options for parameter inputs

## Feature Flag Integration

### Feature Flag Block Design

Feature flags are represented as special blocks:

```javascript
Blockly.common.defineBlocksWithJsonArray([{
  "type": "bicep_feature_flag",
  "message0": "Feature Flag: %1",
  "args0": [
    {
      "type": "field_input",
      "name": "FLAG_NAME",
      "text": "enableHighAvailability"
    }
  ],
  "message1": "Environment: %1",
  "args1": [
    {
      "type": "field_dropdown",
      "name": "ENVIRONMENT",
      "options": [
        ["Development", "dev"],
        ["Testing", "test"],
        ["Staging", "staging"],
        ["Production", "prod"]
      ]
    }
  ],
  "message2": "Value: %1",
  "args2": [
    {
      "type": "input_value",
      "name": "FLAG_VALUE"
    }
  ],
  "output": "Boolean",
  "colour": 290,
  "tooltip": "Environment-specific feature flag"
}]);
```

### Conditional Deployment Integration

Feature flags can be used for conditional deployment:

```javascript
Blockly.common.defineBlocksWithJsonArray([{
  "type": "bicep_conditional_module",
  "message0": "Deploy if %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION",
      "check": "Boolean"
    }
  ],
  "message1": "Module: %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "MODULE"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 210,
  "tooltip": "Conditionally deploy a module based on a condition"
}]);
```

## Git Repository Integration

### Repository Configuration

Repositories are configured with:

```javascript
const repositoryConfig = {
  "repositories": [
    {
      "name": "example/bicep-modules",
      "url": "https://github.com/example/bicep-modules.git",
      "branch": "main",
      "auth": {
        "type": "pat",
        "token": "{{TOKEN}}" // Securely stored
      },
      "paths": [
        "/modules"
      ],
      "refresh": {
        "type": "scheduled",
        "intervalMinutes": 60
      }
    }
  ]
};
```

### Module Caching

Modules are cached locally:

1. **File Cache**: Raw Bicep files stored locally
2. **Metadata Cache**: Parsed module information
3. **Block Definition Cache**: Generated block definitions

### Version Management

Module versions are managed through:

1. **Git Tags**: Specific versions tied to repository tags
2. **Branch Tracking**: Latest version from specific branch
3. **Commit Hashes**: Specific commits for immutable references

## Module Analysis Implementation

### Parser Implementation

The module parser uses a combination of:

1. **Regex Patterns**: For simple parameter and output extraction
2. **AST Parsing**: For complex module structure analysis
3. **Bicep CLI Integration**: For validation and compilation

Example parser implementation:

```javascript
class BicepModuleParser {
  constructor() {
    this.paramRegex = /param\s+(\w+)\s+(\w+)(?:\s*=\s*(.+))?/g;
    this.outputRegex = /output\s+(\w+)\s+(\w+)\s*=\s*(.+)/g;
  }
  
  async parseModule(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const metadata = {
      parameters: [],
      outputs: [],
      resources: []
    };
    
    // Extract parameters
    let match;
    while ((match = this.paramRegex.exec(content)) !== null) {
      const [_, name, type, defaultValue] = match;
      metadata.parameters.push({
        name,
        type,
        defaultValue: defaultValue ? defaultValue.trim() : undefined,
        required: !defaultValue
      });
    }
    
    // Extract outputs
    while ((match = this.outputRegex.exec(content)) !== null) {
      const [_, name, type, value] = match;
      metadata.outputs.push({
        name,
        type,
        value: value.trim()
      });
    }
    
    // Additional parsing for resources and dependencies
    // ...
    
    return metadata;
  }
}
```

### Git Integration Implementation

The git integration uses:

```javascript
class GitRepositoryManager {
  constructor(config) {
    this.config = config;
    this.repositories = new Map();
  }
  
  async cloneRepository(repo) {
    const repoPath = path.join(this.config.cachePath, repo.name);
    
    if (await fs.exists(repoPath)) {
      // Pull latest changes
      const git = simpleGit(repoPath);
      await git.pull();
    } else {
      // Clone repository
      const git = simpleGit();
      if (repo.auth.type === 'pat') {
        const url = new URL(repo.url);
        url.username = repo.auth.token;
        await git.clone(url.toString(), repoPath);
      } else {
        await git.clone(repo.url, repoPath);
      }
    }
    
    // Checkout specific branch or tag
    const git = simpleGit(repoPath);
    await git.checkout(repo.branch);
    
    return repoPath;
  }
  
  async scanForModules(repo) {
    const repoPath = await this.cloneRepository(repo);
    const modules = [];
    
    for (const modulePath of repo.paths) {
      const fullPath = path.join(repoPath, modulePath);
      const files = await glob('**/*.bicep', { cwd: fullPath });
      
      for (const file of files) {
        const parser = new BicepModuleParser();
        const metadata = await parser.parseModule(path.join(fullPath, file));
        
        modules.push({
          name: path.basename(file, '.bicep'),
          path: path.join(modulePath, file),
          repository: repo.name,
          metadata
        });
      }
    }
    
    return modules;
  }
}
```

## Conclusion

This design provides a comprehensive approach for analyzing Bicep modules from git repositories and integrating them as blocks in the Blockly editor. The design focuses on accurately representing module inputs and outputs, enabling their use as integration points, and supporting feature flags for environment-specific configurations.
