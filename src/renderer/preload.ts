import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('app-version'),

  // Git repository operations
  addRepository: (repoUrl: string, branch: string, auth: any) =>
    ipcRenderer.invoke('git-add-repository', repoUrl, branch, auth),
  refreshRepository: (repoId: string) => ipcRenderer.invoke('git-refresh-repository', repoId),
  listRepositories: () => ipcRenderer.invoke('git-list-repositories'),

  // Module operations
  analyzeModule: (modulePath: string) => ipcRenderer.invoke('module-analyze', modulePath),
  listModules: (repoId: string) => ipcRenderer.invoke('module-list', repoId),

  // Feature flag operations
  saveFeatureFlags: (environment: string, flags: any) =>
    ipcRenderer.invoke('feature-flags-save', environment, flags),
  loadFeatureFlags: (environment: string) => ipcRenderer.invoke('feature-flags-load', environment),

  // File operations
  saveBicepFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('file-save-bicep', filePath, content),
  openBicepFile: () => ipcRenderer.invoke('file-open-bicep'),

  // Event listeners
  on: (channel: string, callback: Function) => {
    // Whitelist channels
    const validChannels = ['module-analyzed', 'repository-updated', 'bicep-compiled'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  off: (channel: string, callback: Function) => {
    // Whitelist channels
    const validChannels = ['module-analyzed', 'repository-updated', 'bicep-compiled'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback as any);
    }
  },
});
