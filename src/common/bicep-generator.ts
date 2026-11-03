import * as Blockly from "blockly";
import { BicepCodeGenerationOptions } from "../common/types";

type BicepBlockLike = {
  getFieldValue: (n: string) => string;
  inputList?: unknown[];
};
type GeneratorLike = {
  forBlock: Record<string, (block: BicepBlockLike) => unknown>;
  valueToCode: (block: BicepBlockLike, name: string, order?: unknown) => string;
  statementToCode: (block: BicepBlockLike, name: string) => string;
  ORDER_ATOMIC: number;
  ORDER_MEMBER: number;
  ORDER_FUNCTION_CALL: number;
  ORDER_MULTIPLICATIVE: number;
  ORDER_ADDITIVE: number;
  ORDER_RELATIONAL: number;
  ORDER_LOGICAL_NOT: number;
  ORDER_LOGICAL_AND: number;
  ORDER_LOGICAL_OR: number;
  ORDER_CONDITIONAL: number;
  ORDER_ASSIGNMENT: number;
  ORDER_NONE: number;
};

/**
 * BicepGenerator class for generating Bicep code from Blockly blocks
 */
export class BicepGenerator {
  private workspace: Blockly.WorkspaceSvg;
  private options: BicepCodeGenerationOptions;
  private moduleOutputs: Record<string, { type: string; block: string }> = {};
  public getModuleOutputs(): Record<string, { type: string; block: string }> {
    return this.moduleOutputs;
  }

  /**
   * Constructor
   * @param workspace Blockly workspace
   * @param options Code generation options
   */
  constructor(
    workspace: Blockly.WorkspaceSvg,
    options: BicepCodeGenerationOptions,
  ) {
    this.workspace = workspace;
    this.options = options;
    this.initializeCodeGenerator();
  }

  /**
   * Initialize the Bicep code generator
   */
  private initializeCodeGenerator(): void {
    // Create a custom generator for Bicep
    const blocklyNs = Blockly as unknown as {
      CodeGenerator: new (name: string) => GeneratorLike;
    };
    const bicepGenerator = new blocklyNs.CodeGenerator("Bicep");

    // Define order of operations
    bicepGenerator.ORDER_ATOMIC = 0;
    bicepGenerator.ORDER_MEMBER = 1;
    bicepGenerator.ORDER_FUNCTION_CALL = 2;
    bicepGenerator.ORDER_MULTIPLICATIVE = 3;
    bicepGenerator.ORDER_ADDITIVE = 4;
    bicepGenerator.ORDER_RELATIONAL = 5;
    bicepGenerator.ORDER_LOGICAL_NOT = 6;
    bicepGenerator.ORDER_LOGICAL_AND = 7;
    bicepGenerator.ORDER_LOGICAL_OR = 8;
    bicepGenerator.ORDER_CONDITIONAL = 9;
    bicepGenerator.ORDER_ASSIGNMENT = 10;
    bicepGenerator.ORDER_NONE = 99;

    // Define how to generate code for each block type
    this.defineBlockGenerators(bicepGenerator);

    // Store the generator in the Blockly namespace
    (Blockly as unknown as Record<string, unknown>).Bicep = bicepGenerator;
  }

  /**
   * Define code generators for each block type
   * @param generator Blockly generator
   */
  private defineBlockGenerators(generator: GeneratorLike): void {
    // Storage Account block
    generator.forBlock["bicep_storage_account"] = function (block: {
      getFieldValue: (n: string) => string;
      inputList?: unknown[];
    }) {
      const name = block.getFieldValue("NAME");
      const storageName =
        generator.valueToCode(block, "STORAGE_NAME", generator.ORDER_ATOMIC) ||
        "'defaultStorage'";
      const location =
        generator.valueToCode(block, "LOCATION", generator.ORDER_ATOMIC) ||
        "resourceGroup().location";
      const sku = block.getFieldValue("SKU");

      let code = `resource ${name} 'Microsoft.Storage/storageAccounts@2021-04-01' = {\n`;
      code += `  name: ${storageName}\n`;
      code += `  location: ${location}\n`;
      code += `  sku: {\n`;
      code += `    name: '${sku}'\n`;
      code += `  }\n`;
      code += `  kind: 'StorageV2'\n`;
      code += `}\n\n`;

      return code;
    };

    // Virtual Network block
    generator.forBlock["bicep_virtual_network"] = function (block: {
      getFieldValue: (n: string) => string;
      inputList?: unknown[];
    }) {
      const name = block.getFieldValue("NAME");
      const vnetName =
        generator.valueToCode(block, "VNET_NAME", generator.ORDER_ATOMIC) ||
        "'defaultVNet'";
      const location =
        generator.valueToCode(block, "LOCATION", generator.ORDER_ATOMIC) ||
        "resourceGroup().location";
      const addressSpace =
        generator.valueToCode(block, "ADDRESS_SPACE", generator.ORDER_ATOMIC) ||
        "'10.0.0.0/16'";

      let code = `resource ${name} 'Microsoft.Network/virtualNetworks@2021-02-01' = {\n`;
      code += `  name: ${vnetName}\n`;
      code += `  location: ${location}\n`;
      code += `  properties: {\n`;
      code += `    addressSpace: {\n`;
      code += `      addressPrefixes: [\n`;
      code += `        ${addressSpace}\n`;
      code += `      ]\n`;
      code += `    }\n`;
      code += `  }\n`;
      code += `}\n\n`;

      return code;
    };

    // Feature Flag block
    generator.forBlock["bicep_feature_flag"] = function (
      this: { options: BicepCodeGenerationOptions },
      block: { getFieldValue: (n: string) => string; inputList?: unknown[] },
    ) {
      const environment = block.getFieldValue("ENVIRONMENT");
      const value =
        generator.valueToCode(block, "FLAG_VALUE", generator.ORDER_ATOMIC) ||
        "false";

      // In a real implementation, this would check the current environment
      // and return the appropriate value based on the environment
      const self = this;
      if (environment === self.options.environment) {
        return [value, generator.ORDER_ATOMIC];
      } else {
        return ["false", generator.ORDER_ATOMIC];
      }
    }.bind({ options: this.options, moduleOutputs: this.moduleOutputs });

    // Conditional deployment block
    generator.forBlock["bicep_conditional_deployment"] = function (block: {
      getFieldValue: (n: string) => string;
      inputList?: unknown[];
    }) {
      const condition =
        generator.valueToCode(block, "CONDITION", generator.ORDER_ATOMIC) ||
        "false";
      const resources = generator.statementToCode(block, "RESOURCES");

      let code = `// Conditional deployment based on: ${condition}\n`;
      code += resources
        .split("\n")
        .map((line: string) => {
          if (line.trim().startsWith("resource ")) {
            const parts = line.split("=");
            if (parts.length > 1) {
              return `${parts[0]}= if (${condition}) {\n`;
            }
          }
          return line;
        })
        .join("\n");

      return code;
    };

    // String literal block
    generator.forBlock["bicep_string_literal"] = function (block: {
      getFieldValue: (n: string) => string;
      inputList?: unknown[];
    }) {
      const text = block.getFieldValue("TEXT");
      return [`'${text}'`, generator.ORDER_ATOMIC];
    };

    // Module block generator template
    this.defineModuleBlockGenerator(generator);
  }

  /**
   * Define a generic module block generator that can be used for all module blocks
   * @param generator Blockly generator
   */
  private defineModuleBlockGenerator(generator: GeneratorLike): void {
    generator.forBlock["bicep_module"] = function (
      this: { moduleOutputs: Record<string, { type: string; block: string }> },
      block: { getFieldValue: (n: string) => string; inputList?: unknown[] },
    ) {
      const moduleName = block.getFieldValue("MODULE_NAME");
      const modulePath =
        block.getFieldValue("MODULE_PATH") || "./modules/default.bicep";

      let code = `module ${moduleName} '${modulePath}' = {\n`;
      code += `  params: {\n`;

      // Get all parameter inputs
      const paramInputs = (block.inputList as { name?: string }[]).filter(
        (input): input is { name: string } =>
          Boolean(input.name) && (input.name as string).startsWith("PARAM_"),
      );

      // Generate code for each parameter
      paramInputs.forEach((input) => {
        const paramName = input.name.substring(6); // Remove 'PARAM_' prefix
        let paramValue;

        // Check if the parameter has a field (dropdown) or a connected block (input value)
        const field = (
          block as unknown as {
            getField?: (name: string) => { getValue: () => string } | null;
          }
        ).getField?.(input.name);
        if (field) {
          paramValue = `'${field.getValue()}'`;
        } else {
          paramValue =
            generator.valueToCode(block, input.name, generator.ORDER_ATOMIC) ||
            "null";
        }

        code += `    ${paramName}: ${paramValue}\n`;
      });

      code += `  }\n`;
      code += `}\n\n`;

      // Register module outputs
      const outputConnections =
        (
          block as unknown as {
            outputConnections?: { name: string; type: string }[];
          }
        ).outputConnections ?? [];
      outputConnections.forEach(
        (connection: { name: string; type: string }) => {
          const outputName = connection.name.substring(7); // Remove 'OUTPUT_' prefix
          this.moduleOutputs[`${moduleName}.outputs.${outputName}`] = {
            type: connection.type,
            block: moduleName,
          };
        },
      );

      return code;
    }.bind({ options: this.options, moduleOutputs: this.moduleOutputs });
  }

  /**
   * Generate Bicep code from the workspace
   * @returns Generated Bicep code
   */
  public generateCode(): string {
    // Clear module outputs registry
    this.moduleOutputs = {};

    // Add header
    let code = `// Bicep template generated by Bicep Blockly Editor\n`;
    code += `// Environment: ${this.options.environment}\n`;
    code += `// Generated on: ${new Date().toISOString()}\n\n`;

    // Generate code from workspace
    code += (
      Blockly as unknown as Record<
        string,
        { workspaceToCode: (w: Blockly.WorkspaceSvg) => string }
      >
    ).Bicep.workspaceToCode(this.workspace);

    return code;
  }
}
