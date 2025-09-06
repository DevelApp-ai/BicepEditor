import * as Blockly from 'blockly';
import { BicepBlockFactory } from '../common/bicep-blocks';
import { BicepGenerator } from '../common/bicep-generator';
import { FeatureFlagBlockManager } from '../common/feature-flag-blocks';
import { BicepCodeGenerationOptions } from '../common/types';

// Declare the API interface for TypeScript
declare global {
  interface Window {
    api: {
      getAppVersion: () => Promise<string>;
      addRepository: (repoUrl: string, branch: string, auth: any) => Promise<any>;
      refreshRepository: (repoId: string) => Promise<any>;
      listRepositories: () => Promise<any[]>;
      analyzeModule: (modulePath: string) => Promise<any>;
      listModules: (repoId: string) => Promise<any[]>;
      saveFeatureFlags: (environment: string, flags: any) => Promise<void>;
      loadFeatureFlags: (environment: string) => Promise<any>;
      saveBicepFile: (
        filePath: string,
        content: string
      ) => Promise<{ path: string; success: boolean } | null>;
      openBicepFile: () => Promise<{ path: string; content: string } | null>;
      on: (channel: string, callback: Function) => void;
      off: (channel: string, callback: Function) => void;
    };
  }
}

/**
 * BicepBlocklyEditor class for managing the Blockly editor for Bicep
 */
export class BicepBlocklyEditor {
  private workspace: Blockly.WorkspaceSvg;
  private bicepGenerator: BicepGenerator;
  private featureFlagManager: FeatureFlagBlockManager;
  private currentFilePath: string | null = null;

  /**
   * Constructor
   */
  constructor() {
    this.initializeBlockly();
    this.workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    this.bicepGenerator = new BicepGenerator(this.workspace, {
      environment: 'development',
      indentation: '  ',
      includeComments: true,
    });
    this.featureFlagManager = new FeatureFlagBlockManager(this.workspace);
    this.setupEventListeners();
    this.initializeBlocks();
  }

  /**
   * Initialize Blockly workspace
   */
  private initializeBlockly(): void {
    // Define the toolbox
    const toolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Core Resources',
          colour: '#5C81A6',
          contents: [
            {
              kind: 'block',
              type: 'bicep_storage_account',
            },
            {
              kind: 'block',
              type: 'bicep_virtual_network',
            },
            {
              kind: 'block',
              type: 'bicep_conditional_deployment',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Values',
          colour: '#A6745C',
          contents: [
            {
              kind: 'block',
              type: 'bicep_string_literal',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Modules',
          colour: '#5CA65C',
          contents: [
            // Will be populated with module blocks from repositories
          ],
        },
      ],
    };

    // Inject Blockly into the workspace div
    Blockly.inject('blocklyDiv', {
      toolbox: toolbox,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
    });
  }

  /**
   * Initialize blocks
   */
  private async initializeBlocks(): Promise<void> {
    // Create core blocks
    BicepBlockFactory.createCoreBlocks();

    // Load feature flags
    await this.featureFlagManager.loadFeatureFlags();
    this.featureFlagManager.createFeatureFlagBlocks();

    // Update code preview
    this.updateCodePreview();
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Listen for workspace changes
    this.workspace.addChangeListener(() => {
      this.updateCodePreview();
    });

    // New file button
    const newFileButton = document.getElementById('newFile');
    if (newFileButton) {
      newFileButton.addEventListener('click', () => {
        this.newFile();
      });
    }

    // Open file button
    const openFileButton = document.getElementById('openFile');
    if (openFileButton) {
      openFileButton.addEventListener('click', () => {
        this.openFile();
      });
    }

    // Save file button
    const saveFileButton = document.getElementById('saveFile');
    if (saveFileButton) {
      saveFileButton.addEventListener('click', () => {
        this.saveFile();
      });
    }

    // Environment selector
    const environmentSelector = document.getElementById('environmentSelector') as HTMLSelectElement;
    if (environmentSelector) {
      environmentSelector.addEventListener('change', () => {
        this.updateEnvironment(environmentSelector.value);
      });
    }
  }

  /**
   * Update code preview
   */
  private updateCodePreview(): void {
    const code = this.bicepGenerator.generateCode();
    const codePreview = document.getElementById('generatedCode');
    if (codePreview) {
      codePreview.textContent = code;
    }
  }

  /**
   * Update environment
   * @param environment Environment name
   */
  private updateEnvironment(environment: string): void {
    // Update generator options
    this.bicepGenerator = new BicepGenerator(this.workspace, {
      environment,
      indentation: '  ',
      includeComments: true,
    });

    // Update code preview
    this.updateCodePreview();

    // Log to console
    this.logToConsole(`Switched to ${environment} environment`);
  }

  /**
   * Create a new file
   */
  private newFile(): void {
    // Clear workspace
    this.workspace.clear();
    this.currentFilePath = null;

    // Log to console
    this.logToConsole('Created new file');
  }

  /**
   * Open a file
   */
  private async openFile(): Promise<void> {
    try {
      const result = await window.api.openBicepFile();
      if (!result) {
        return;
      }

      // Clear workspace
      this.workspace.clear();

      // TODO: Parse Bicep file and create blocks
      // This would require a Bicep parser to convert Bicep code to blocks
      // For now, just show the code in the preview
      const codePreview = document.getElementById('generatedCode');
      if (codePreview) {
        codePreview.textContent = result.content;
      }

      this.currentFilePath = result.path;
      this.logToConsole(`Opened file: ${result.path}`);
    } catch (error) {
      console.error('Error opening file:', error);
      this.logToConsole(`Error opening file: ${error}`, 'error');
    }
  }

  /**
   * Save a file
   */
  private async saveFile(): Promise<void> {
    try {
      const code = this.bicepGenerator.generateCode();
      const result = await window.api.saveBicepFile(this.currentFilePath || '', code);
      if (!result) {
        return;
      }

      this.currentFilePath = result.path;
      this.logToConsole(`Saved file: ${result.path}`);
    } catch (error) {
      console.error('Error saving file:', error);
      this.logToConsole(`Error saving file: ${error}`, 'error');
    }
  }

  /**
   * Log to console
   * @param message Message to log
   * @param type Log type
   */
  private logToConsole(message: string, type: 'info' | 'warning' | 'error' = 'info'): void {
    const consoleOutput = document.getElementById('consoleOutput');
    if (consoleOutput) {
      const logEntry = document.createElement('div');
      logEntry.className = `log-entry log-${type}`;
      logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      consoleOutput.appendChild(logEntry);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
  }

  /**
   * Add a module block from repository
   * @param moduleMetadata Module metadata
   */
  public addModuleBlock(moduleMetadata: any): void {
    // Create block definition
    const blockDef = BicepBlockFactory.createModuleBlockDefinition(moduleMetadata);

    // Register block
    BicepBlockFactory.registerModuleBlock(blockDef);

    // Add to toolbox
    const toolbox = this.workspace.getToolbox();
    if (toolbox) {
      // Find modules category
      // @ts-ignore - toolboxDef is not in the type definitions
      const toolboxDef = toolbox.getToolboxDef();
      const modulesCategory = toolboxDef.contents.find(
        (category: any) => category.name === 'Modules'
      );

      if (modulesCategory) {
        // Add block to category
        modulesCategory.contents.push({
          kind: 'block',
          type: blockDef.type,
        });

        // Refresh toolbox
        toolbox.render(toolboxDef);
      }
    }
  }
}
