import { ipcMain, dialog, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * BicepFileManager class for managing Bicep files
 */
export class BicepFileManager {
  private recentFiles: string[] = [];
  private maxRecentFiles: number = 10;
  private configPath: string;

  /**
   * Constructor
   * @param configPath Path to configuration directory
   */
  constructor(configPath: string) {
    this.configPath = configPath;
    this.setupIpcHandlers();
    this.loadRecentFiles();
  }

  /**
   * Set up IPC handlers for file operations
   */
  private setupIpcHandlers(): void {
    // Open Bicep file
    ipcMain.handle('file-open-bicep', async event => {
      try {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (!window) {
          throw new Error('Window not found');
        }

        const result = await dialog.showOpenDialog(window, {
          title: 'Open Bicep File',
          filters: [
            { name: 'Bicep Files', extensions: ['bicep'] },
            { name: 'All Files', extensions: ['*'] },
          ],
          properties: ['openFile'],
        });

        if (result.canceled || result.filePaths.length === 0) {
          return null;
        }

        const filePath = result.filePaths[0];
        const content = fs.readFileSync(filePath, 'utf8');

        this.addRecentFile(filePath);

        return {
          path: filePath,
          content,
        };
      } catch (error) {
        console.error('Error opening Bicep file:', error);
        throw error;
      }
    });

    // Save Bicep file
    ipcMain.handle('file-save-bicep', async (event, filePath: string, content: string) => {
      try {
        let finalPath = filePath;
        const window = BrowserWindow.fromWebContents(event.sender);

        if (!window) {
          throw new Error('Window not found');
        }

        // If no file path provided, show save dialog
        if (!filePath) {
          const result = await dialog.showSaveDialog(window, {
            title: 'Save Bicep File',
            filters: [
              { name: 'Bicep Files', extensions: ['bicep'] },
              { name: 'All Files', extensions: ['*'] },
            ],
          });

          if (result.canceled || !result.filePath) {
            return null;
          }

          finalPath = result.filePath;
        }

        fs.writeFileSync(finalPath, content, 'utf8');
        this.addRecentFile(finalPath);

        return {
          path: finalPath,
          success: true,
        };
      } catch (error) {
        console.error('Error saving Bicep file:', error);
        throw error;
      }
    });

    // Get recent files
    ipcMain.handle('file-get-recent', async () => {
      try {
        return this.recentFiles;
      } catch (error) {
        console.error('Error getting recent files:', error);
        throw error;
      }
    });

    // Validate Bicep file
    ipcMain.handle('file-validate-bicep', async (event, content: string) => {
      try {
        // Create temporary file
        const tempDir = path.join(this.configPath, 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFile = path.join(tempDir, `temp_${Date.now()}.bicep`);
        fs.writeFileSync(tempFile, content, 'utf8');

        try {
          // Run Bicep validation
          const { stdout } = await execAsync(`az bicep build --file ${tempFile}`);

          // Clean up
          fs.unlinkSync(tempFile);

          return {
            valid: true,
            output: stdout,
          };
        } catch (error: any) {
          // Clean up
          fs.unlinkSync(tempFile);

          return {
            valid: false,
            error: error.stderr || error.message,
          };
        }
      } catch (error: any) {
        console.error('Error validating Bicep file:', error);
        return {
          valid: false,
          error: error.message,
        };
      }
    });
  }

  /**
   * Load recent files from config
   */
  private loadRecentFiles(): void {
    try {
      const recentFilesPath = path.join(this.configPath, 'recent_files.json');

      if (fs.existsSync(recentFilesPath)) {
        const data = fs.readFileSync(recentFilesPath, 'utf8');
        this.recentFiles = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading recent files:', error);
      this.recentFiles = [];
    }
  }

  /**
   * Save recent files to config
   */
  private saveRecentFiles(): void {
    try {
      const recentFilesPath = path.join(this.configPath, 'recent_files.json');
      fs.writeFileSync(recentFilesPath, JSON.stringify(this.recentFiles), 'utf8');
    } catch (error) {
      console.error('Error saving recent files:', error);
    }
  }

  /**
   * Add a file to recent files
   * @param filePath File path
   */
  private addRecentFile(filePath: string): void {
    // Remove if already exists
    this.recentFiles = this.recentFiles.filter(file => file !== filePath);

    // Add to beginning
    this.recentFiles.unshift(filePath);

    // Limit to max recent files
    if (this.recentFiles.length > this.maxRecentFiles) {
      this.recentFiles = this.recentFiles.slice(0, this.maxRecentFiles);
    }

    this.saveRecentFiles();
  }
}
