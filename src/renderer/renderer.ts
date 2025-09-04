import * as Blockly from 'blockly';
import { ipcRenderer } from 'electron';

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
      saveBicepFile: (filePath: string, content: string) => Promise<void>;
      openBicepFile: (filePath: string) => Promise<string>;
      on: (channel: string, callback: Function) => void;
      off: (channel: string, callback: Function) => void;
    };
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeBlockly();
  setupEventListeners();
  setupTabSwitching();
});

// Initialize Blockly workspace
function initializeBlockly() {
  // Define the toolbox
  const toolbox = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Core Resources',
        colour: '#5C81A6',
        contents: [
          // Will be populated with core Bicep blocks
        ]
      },
      {
        kind: 'category',
        name: 'Modules',
        colour: '#5CA65C',
        contents: [
          // Will be populated with module blocks from repositories
        ]
      },
      {
        kind: 'category',
        name: 'Feature Flags',
        colour: '#A65C81',
        contents: [
          // Will be populated with feature flag blocks
        ]
      }
    ]
  };

  // Inject Blockly into the workspace div
  const workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    trashcan: true
  });

  // Add change listener to update code preview
  workspace.addChangeListener(() => {
    updateCodePreview(workspace);
  });
}

// Update the code preview panel with generated Bicep code
function updateCodePreview(workspace: Blockly.WorkspaceSvg) {
  // This will be replaced with actual Bicep code generation
  const code = 'param storageAccountName string\nparam location string = resourceGroup().location\n\nresource storageAccount \'Microsoft.Storage/storageAccounts@2021-04-01\' = {\n  name: storageAccountName\n  location: location\n  sku: {\n    name: \'Standard_LRS\'\n  }\n  kind: \'StorageV2\'\n}';
  
  const codePreview = document.getElementById('generatedCode');
  if (codePreview) {
    codePreview.textContent = code;
  }
}

// Set up event listeners for UI elements
function setupEventListeners() {
  // New file button
  const newFileButton = document.getElementById('newFile');
  if (newFileButton) {
    newFileButton.addEventListener('click', () => {
      // Clear workspace and start new file
      console.log('New file');
    });
  }

  // Open file button
  const openFileButton = document.getElementById('openFile');
  if (openFileButton) {
    openFileButton.addEventListener('click', async () => {
      try {
        // Open file dialog will be implemented here
        console.log('Open file');
      } catch (error) {
        console.error('Error opening file:', error);
      }
    });
  }

  // Save file button
  const saveFileButton = document.getElementById('saveFile');
  if (saveFileButton) {
    saveFileButton.addEventListener('click', async () => {
      try {
        // Save file dialog will be implemented here
        console.log('Save file');
      } catch (error) {
        console.error('Error saving file:', error);
      }
    });
  }

  // Environment selector
  const environmentSelector = document.getElementById('environmentSelector') as HTMLSelectElement;
  if (environmentSelector) {
    environmentSelector.addEventListener('change', async () => {
      const environment = environmentSelector.value;
      try {
        // Load feature flags for selected environment
        const flags = await window.api.loadFeatureFlags(environment);
        console.log(`Loaded feature flags for ${environment}:`, flags);
        // Update UI based on selected environment
      } catch (error) {
        console.error(`Error loading feature flags for ${environment}:`, error);
      }
    });
  }
}

// Set up tab switching in the bottom panel
function setupTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      if (tabId) {
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
          tabContent.classList.add('active');
        }
      }
    });
  });
}

// Log to console output
function logToConsole(message: string, type: 'info' | 'warning' | 'error' = 'info') {
  const consoleOutput = document.getElementById('consoleOutput');
  if (consoleOutput) {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    consoleOutput.appendChild(logEntry);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }
}

// Initialize application version
async function initAppVersion() {
  try {
    const version = await window.api.getAppVersion();
    console.log(`Bicep Blockly Editor v${version}`);
  } catch (error) {
    console.error('Error getting app version:', error);
  }
}

// Call initialization functions
initAppVersion();
