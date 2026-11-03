// Common types and interfaces for the Bicep Blockly Editor

/**
 * Repository configuration interface
 */
export interface RepositoryConfig {
  id: string;
  name: string;
  url: string;
  branch: string;
  auth: {
    type: "none" | "pat" | "ssh";
    token?: string;
    keyPath?: string;
  };
  paths: string[];
  refresh: {
    type: "manual" | "scheduled";
    intervalMinutes?: number;
  };
}

/**
 * Bicep module parameter interface
 */
export interface ModuleParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
  allowedValues?: string[];
  constraints?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
  };
}

/**
 * Bicep module output interface
 */
export interface ModuleOutput {
  name: string;
  type: string;
  description?: string;
  value: string;
}

/**
 * Bicep module resource interface
 */
export interface ModuleResource {
  type: string;
  apiVersion: string;
  name?: string;
}

/**
 * Bicep module metadata interface
 */
export interface ModuleMetadata {
  moduleName: string;
  moduleSource: string;
  modulePath: string;
  description?: string;
  parameters: ModuleParameter[];
  outputs: ModuleOutput[];
  resources: ModuleResource[];
  version?: string;
  lastUpdated: string;
}

/**
 * Feature flag interface
 */
export interface FeatureFlag {
  name: string;
  type: "boolean" | "string" | "number" | "object";
  value: unknown;
  description?: string;
}

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  name: string;
  featureFlags: FeatureFlag[];
}

/**
 * Block definition for Bicep module
 */
export interface BicepModuleBlockDefinition {
  type: string;
  message0: string;
  args0: unknown[];
  output?: string;
  outputConnections?: {
    name: string;
    type: string;
  }[];
  colour: number;
  tooltip?: string;
  helpUrl?: string;
}

/**
 * Bicep code generation options
 */
export interface BicepCodeGenerationOptions {
  environment: string;
  indentation: string;
  includeComments: boolean;
}
