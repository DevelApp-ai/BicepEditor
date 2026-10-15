import { ModuleMetadata, ModuleOutput, ModuleParameter, ModuleResource } from './types';

/**
 * Shared Bicep module parser. Works on file contents regardless of whether
 * they came from local disk (Electron) or the GitHub API (browser).
 */
export class BicepModuleParser {
  parse(fileName: string, content: string, sourcePath: string): ModuleMetadata {
    return {
      moduleName: fileName.replace(/\.bicep$/i, ''),
      moduleSource: sourcePath,
      modulePath: sourcePath,
      description: this.extractDescription(content),
      parameters: this.extractParameters(content),
      outputs: this.extractOutputs(content),
      resources: this.extractResources(content),
      lastUpdated: new Date().toISOString(),
    };
  }

  private extractDescription(content: string): string | undefined {
    const match = /\/\/\s*(.+)/.exec(content);
    return match ? match[1].trim() : undefined;
  }

  private extractParameters(content: string): ModuleParameter[] {
    const parameters: ModuleParameter[] = [];
    const regex = /param\s+(\w+)\s+(\w+)(\s*=\s*(.+?))?\s*(\/\/\s*(.+))?$/gm;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const defaultValue = match[4] ? match[4].trim() : undefined;
      parameters.push({
        name: match[1],
        type: match[2],
        required: defaultValue === undefined,
        defaultValue,
        description: match[6] ? match[6].trim() : undefined,
      });
    }
    return parameters;
  }

  private extractOutputs(content: string): ModuleOutput[] {
    const outputs: ModuleOutput[] = [];
    const regex = /output\s+(\w+)\s+(\w+)\s*=\s*(.+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      outputs.push({
        name: match[1],
        type: match[2],
        value: match[3].trim(),
      });
    }
    return outputs;
  }

  private extractResources(content: string): ModuleResource[] {
    const resources: ModuleResource[] = [];
    const regex = /resource\s+(\w+)\s+'([^'@]+)@([^'\s]+)'?/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      resources.push({
        type: match[2],
        apiVersion: match[3],
        name: match[1],
      });
    }
    return resources;
  }
}
