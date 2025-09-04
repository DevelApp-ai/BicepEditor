# Bicep Blockly Editor - Installation Guide

## System Requirements

The Bicep Blockly Editor is a cross-platform application that runs on:

- **Windows**: Windows 10 or later (64-bit)
- **macOS**: macOS 10.13 (High Sierra) or later
- **Linux**: Ubuntu 18.04 or later, Fedora 28 or later, or other compatible distributions

### Hardware Requirements

- **Processor**: 1.6 GHz or faster, dual-core
- **Memory**: 4 GB RAM minimum, 8 GB RAM recommended
- **Disk Space**: 500 MB available space
- **Display**: 1280 x 720 screen resolution or higher

### Software Prerequisites

- **Git**: Required for repository integration (version 2.20 or later)
- **Azure CLI**: Optional, but recommended for Bicep validation and deployment (version 2.30 or later)

## Installation Instructions

### Windows Installation

1. Download the Windows installer (`BicepBlocklyEditor-Setup-x.x.x.exe`) from the releases page.
2. Run the installer executable.
3. Follow the on-screen instructions in the setup wizard.
4. Choose the installation location or accept the default.
5. Select whether to create desktop and Start menu shortcuts.
6. Complete the installation.
7. Launch the application from the desktop shortcut or Start menu.

### macOS Installation

1. Download the macOS disk image (`BicepBlocklyEditor-x.x.x.dmg`) from the releases page.
2. Open the downloaded DMG file.
3. Drag the Bicep Blockly Editor application to the Applications folder.
4. Eject the disk image.
5. Open the Applications folder and launch Bicep Blockly Editor.
6. If prompted about opening an application from an unidentified developer:
   - Right-click (or Control-click) the app icon and select "Open"
   - Click "Open" in the dialog that appears

### Linux Installation

#### Using AppImage (Recommended)

1. Download the AppImage file (`BicepBlocklyEditor-x.x.x.AppImage`) from the releases page.
2. Make the AppImage executable:
   ```
   chmod +x BicepBlocklyEditor-x.x.x.AppImage
   ```
3. Run the AppImage:
   ```
   ./BicepBlocklyEditor-x.x.x.AppImage
   ```

#### Using Debian/Ubuntu Package

1. Download the Debian package (`bicep-blockly-editor_x.x.x_amd64.deb`) from the releases page.
2. Install the package:
   ```
   sudo dpkg -i bicep-blockly-editor_x.x.x_amd64.deb
   sudo apt-get install -f
   ```
3. Launch the application from the applications menu or run:
   ```
   bicep-blockly-editor
   ```

#### Using RPM Package

1. Download the RPM package (`bicep-blockly-editor-x.x.x.x86_64.rpm`) from the releases page.
2. Install the package:
   ```
   sudo rpm -i bicep-blockly-editor-x.x.x.x86_64.rpm
   ```
3. Launch the application from the applications menu or run:
   ```
   bicep-blockly-editor
   ```

## First-Time Setup

When you launch the Bicep Blockly Editor for the first time, you'll need to complete a few setup steps:

1. **Welcome Screen**: Click "Get Started" to begin.

2. **Git Configuration** (Optional):
   - If you want to use git repository integration, you'll be prompted to configure git settings.
   - You can provide your git username and email, or skip this step and configure it later.

3. **Azure CLI Check** (Optional):
   - The application will check if Azure CLI is installed.
   - If not installed, you'll see instructions on how to install it.
   - You can skip this step if you don't need Azure CLI integration.

4. **Default Environment Setup**:
   - The application will create default environment configurations (Development, Testing, Staging, Production).
   - You can customize these environments later.

5. **Sample Project** (Optional):
   - You'll be offered to create a sample project to explore the editor's features.
   - Choose "Create Sample Project" or "Skip" to start with a blank workspace.

## Updating the Application

### Automatic Updates

The Bicep Blockly Editor includes an automatic update feature:

1. When a new version is available, you'll see a notification in the application.
2. Click "Download Update" to download the update in the background.
3. Once downloaded, click "Install Update" to install and restart the application.

### Manual Updates

To update manually:

1. Download the latest version from the releases page.
2. Install it using the same method as your initial installation.
3. The new version will replace the existing installation while preserving your settings and projects.

## Uninstallation

### Windows Uninstallation

1. Open Windows Settings > Apps > Apps & features.
2. Find "Bicep Blockly Editor" in the list.
3. Click on it and select "Uninstall".
4. Follow the uninstallation wizard.

### macOS Uninstallation

1. Open the Applications folder in Finder.
2. Drag the Bicep Blockly Editor application to the Trash.
3. Empty the Trash to complete the uninstallation.

### Linux Uninstallation

#### AppImage

Simply delete the AppImage file.

#### Debian/Ubuntu Package

```
sudo apt-get remove bicep-blockly-editor
```

#### RPM Package

```
sudo rpm -e bicep-blockly-editor
```

## Troubleshooting Installation Issues

### Common Issues and Solutions

#### Application Won't Start

- **Windows**: Check the Event Viewer for application errors.
- **macOS**: Check Console.app for error messages.
- **Linux**: Run the application from the terminal to see error output.

#### Missing Dependencies on Linux

If you encounter missing dependencies on Linux:

```
sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libuuid1
```

#### Permission Issues on Linux

If you encounter permission issues with the AppImage:

```
chmod +x BicepBlocklyEditor-x.x.x.AppImage
```

#### Git Integration Issues

- Ensure git is installed and available in your PATH.
- Check your git credentials if you're having authentication issues.

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting section in the User Guide](user_guide.md#troubleshooting).
2. Visit the project repository to search for known issues or report a new one.
3. Contact support for additional assistance.

## Conclusion

You have successfully installed the Bicep Blockly Editor. Refer to the [User Guide](user_guide.md) to learn how to use the application and the [Developer Guide](developer_guide.md) if you're interested in extending or modifying the editor.
