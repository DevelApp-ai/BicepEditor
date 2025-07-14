# Bicep Module Research

## Overview
Bicep is a domain-specific language (DSL) for deploying Azure resources declaratively. It provides a transparent abstraction over ARM (Azure Resource Manager) templates. Bicep files are transpiled to standard ARM template JSON files, which are then used for deployment.

## Module Structure

### Basic Module Syntax
```bicep
module <symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}
```

### Key Components of Modules

1. **Symbolic Name**: Used to reference the module elsewhere in the Bicep file
2. **Path**: Can be a local file or a file in a registry (Bicep file or ARM JSON template)
3. **Name**: Optional property that becomes the name of the nested deployment resource
4. **Parameters**: Input values passed to the module

## Module Inputs (Parameters)

Parameters in Bicep modules follow this syntax:
```bicep
param <parameter-name> <parameter-data-type> = <default-value>
```

### Parameter Features:
- **Data Types**: string, int, bool, object, array, and user-defined types
- **Default Values**: Optional default values can be provided
- **Decorators**: Used for constraints or metadata (@description, @allowed, @minLength, etc.)
- **Secure Parameters**: Can be marked as secure to hide sensitive values

### Parameter Constraints:
- Maximum of 256 parameters per Bicep file
- Parameter names must be unique within a scope
- Parameters can't reference variables

## Module Outputs

Outputs in Bicep modules follow this syntax:
```bicep
output <name> <data-type> = <value>
```

### Output Features:
- **Data Types**: Same as parameters (string, int, bool, object, array, user-defined types)
- **Decorators**: Similar to parameters (@description, @minLength, etc.)
- **Conditional Outputs**: Can be conditionally returned using the `?` operator
- **Dynamic Outputs**: Can create multiple outputs using loops

### Output Constraints:
- Limited to 64 outputs in a Bicep file
- Output names must be unique within a scope

## Module Integration and Analysis

### Module Interaction
- Modules can reference outputs from other modules
- Modules can be conditionally deployed using `if` expressions
- Multiple instances of a module can be deployed using `for` loops
- Dependencies between modules can be explicitly set using `dependsOn`

### Git Repository Integration
- Modules can be stored in git repositories and referenced
- Azure Verified Modules (AVM) provide pre-built, tested modules
- Private module registries can be used to share modules within organizations
- Template specs can be used as an alternative to module registries

### Challenges with Module Analysis
- Modules are compiled down to ARM JSON templates for deployment
- Module outputs can only be used after the module has executed
- Using module outputs as inputs to other resources requires careful planning
- Scope considerations are important when deploying modules

## Feature Flag Implementation
- Feature flags can be implemented using parameters and conditional deployment
- Different environments can be configured using parameter files
- Conditional expressions can control which resources are deployed
- Module outputs can vary based on feature flag settings

## Key Insights for Bicep Editor Development
1. Need to analyze module files to extract parameter and output definitions
2. Must support visualization of module dependencies and data flow
3. Should provide mechanisms to pull modules from git repositories
4. Need to handle module scopes and deployment contexts
5. Should support feature flag configuration for different environments
6. Must visualize the relationship between inputs and outputs across modules
