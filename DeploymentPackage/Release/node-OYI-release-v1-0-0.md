# OYI 1.0.0 (Release)

Tag: OYI-Release-v1.0.0 • Date: 2025-08-27 • Commit: Initial Release

## Summary

**Initial stable release of OYI - Open in your IDE extension.** A powerful VS Code extension that adds intelligent context menu options to open projects in 35+ different IDEs with advanced workspace isolation technology.

## Highlights

- **Universal IDE Support** - Support for 35+ IDEs including Visual Studio, JetBrains suite, Xcode, embedded development tools, and data science environments
- **Advanced Workspace Isolation** - Sophisticated conflict prevention system allowing seamless coexistence between VS Code and other IDEs
- **Intelligent Project Detection** - Smart detection of appropriate IDEs based on file extensions and project types with automatic IDE discovery
- **Enterprise-Ready** - Professional-grade features with comprehensive internationalization support for 28+ languages
- **Zero Configuration** - Works out of the box with automatic IDE detection and intelligent context menus

## Changes

| Type | Description |
|------|-------------|
| **Feature** | Initial release with support for 35+ IDEs across Windows, macOS, and Linux platforms |
| **Feature** | Advanced workspace isolation system with process separation and conflict detection |
| **Feature** | Comprehensive internationalization with native support for 28 languages and regional variants |
| **Feature** | Intelligent context menu with file extension awareness and project-type suggestions |
| **Feature** | Professional Visual Studio integration with specialized options and instance management |
| **Feature** | Embedded development support for STM32, MPLAB X, Keil, IAR, and Arduino environments |
| **Feature** | Data science integration with RStudio, MATLAB, Spyder, and scientific computing tools |
| **Feature** | JetBrains Toolbox support with automatic detection of all JetBrains IDEs |
| **Feature** | Cross-platform compatibility with platform-specific optimizations |
| **Feature** | Extensive configuration system with custom IDE paths and advanced options |

## Supported IDEs (35+)

### Enterprise & Professional

- **Visual Studio** (2017, 2019, 2022)
- **JetBrains Suite** (IntelliJ IDEA, WebStorm, PyCharm, Rider, CLion, GoLand, RubyMine, PhpStorm, RustRover)
- **Eclipse, NetBeans**

### Platform-Specific

- **Xcode** (macOS) - iOS/macOS development
- **Android Studio** - Android development

### Embedded & Microcontroller

- **STM32CubeIDE, MPLAB X, Keil µVision, IAR Embedded Workbench**
- **Code Composer Studio, Arduino IDE**

### Data Science & Research

- **RStudio, MATLAB, Spyder, Wing Pro, Octave**

### Specialized Development

- **Qt Creator, Code::Blocks, Processing**
- **Delphi/RAD Studio, Lazarus**

### Text Editors & Lightweight

- **Sublime Text, Atom, Brackets, Nova, Vim, Emacs**

## Key Features

### 🛡️ **Advanced Workspace Isolation**

- **Process Isolation**: Each IDE runs in isolated process space
- **Workspace Separation**: Prevents file locking conflicts
- **Smart Conflict Detection**: Automatic conflict resolution
- **Enhanced Multi-IDE Workflows**: Seamless IDE switching

### 🎯 **Intelligent Detection**

- **Automatic IDE Discovery**: System-wide IDE scanning
- **Platform-Aware**: Windows Registry, macOS Applications, Linux paths
- **JetBrains Toolbox Support**: Automatic detection of Toolbox installations
- **Version-Aware**: Multiple IDE versions simultaneously
- **Fallback Mechanisms**: Reliable detection across installation methods

### 🌍 **Internationalization**

Native support for 28+ languages including:

- English variants (US, GB, CA, AU, IN)
- Spanish variants (ES, MX, AR, CO, PE)
- Portuguese variants (BR, PT)
- French, German, Italian, Japanese, Korean, Chinese, Russian, Arabic, and more

### ⚙️ **Enterprise Configuration**

- **Enabled IDEs Control**: Customize which IDEs appear in menus
- **Custom IDE Paths**: Override automatic detection
- **Workspace Isolation Settings**: Advanced conflict prevention options
- **Visual Studio Specific Options**: Specialized Visual Studio integration
- **Platform Filtering**: Show only compatible IDEs

## Installation

1. **Via VS Code Marketplace:**
   - Open VS Code Extensions (`Ctrl+Shift+X`)
   - Search for "OYI" or "Open in your IDE"
   - Click Install

2. **Via VSIX Package:**
   - Download the .vsix file from this release
   - Install via Extensions > … > Install from VSIX

## Usage

1. **Right-click** on any file or folder in VS Code Explorer
2. Select **"Open in IDE"** from the context menu
3. Choose your preferred IDE from the intelligent suggestions
4. Project opens instantly with workspace isolation active

## Changelog

```text
## [1.0.0] - 2025-08-27

### Initial Release

#### Core Features
- Universal IDE Integration: Added support for 35+ IDEs with intelligent context menu options
- Smart Project Detection: Automatically detects appropriate IDEs based on file extensions and project types
- Cross-Platform Support: Full compatibility with Windows, macOS, and Linux
- Zero Configuration Setup: Works out of the box with automatic IDE detection

#### Advanced Features
- Universal Workspace Isolation: All IDEs can coexist with VS Code without conflicts
- Smart Conflict Detection: Automatically prevents workspace conflicts between IDEs
- Enhanced Multi-IDE Workflows: Seamless switching between development environments
- Configurable Isolation Options with advanced timeout and conflict detection

#### Internationalization
- Multi-Language Support: Native support for 28 languages and regional variants
- Complete localization system with organized l10n structure

#### IDE Detection System
- Automatic IDE Detection: Scans system for installed IDEs across platforms
- JetBrains Toolbox Support: Detects IDEs installed via JetBrains Toolbox
- Version-Aware Detection: Supports multiple versions of the same IDE
- Fallback Detection: Multiple detection methods for reliability
```

More details in [CHANGELOG.md](https://github.com/OrvexaDev/OYI/blob/main/CHANGELOG.md)

## Technical Specifications

- **Architecture**: TypeScript with VS Code Extension API
- **Build System**: esbuild with TypeScript compiler
- **Testing**: Mocha with VS Code Test Runner
- **Platforms**: Windows, macOS, Linux
- **VS Code Compatibility**: 1.60.0+
- **Languages**: 28+ supported languages with full localization

## Status

- **Build**: ✅ Passing
- **Tests**: ✅ All tests passing across platforms
- **Lint**: ✅ ESLint compliant
- **Security**: ✅ Security audit clean
- **Compatibility**: ✅ Cross-platform tested

## Known Issues

- Some IDEs may require manual path configuration if installed in non-standard locations
- JetBrains Toolbox detection may need VS Code restart after new IDE installations
- On Linux, some IDEs may require additional permissions for proper detection

## Performance

- **Fast IDE Detection**: Optimized scanning algorithms
- **Minimal Memory Footprint**: Efficient resource usage
- **Quick Context Menu**: Instant response times
- **Background Processing**: Non-blocking IDE detection and launching

## Security & Privacy

- **No Data Collection**: Extension operates entirely locally
- **No Network Requests**: All functionality is offline
- **Secure IDE Launching**: Validated execution paths
- **Privacy-First**: No telemetry or user data transmission

## Future Roadmap

- Additional IDE support based on community feedback
- Enhanced project detection algorithms with machine learning
- Advanced workspace management with project templates
- Plugin system for custom IDE integrations
- Performance optimizations and intelligent caching
- Extended configuration options with GUI settings panel

## Credits

**Development Team:**

- **Orvexa by KAGEYOSHI** - Lead Developer and Architect

**Community Contributors:**

- All contributors who provided feedback during development
- Beta testers across different platforms and IDE configurations
- Translation contributors for internationalization support

**Special Thanks:**

- **Microsoft** - For the VS Code platform and Extension API
- **JetBrains** - For the excellent IDE ecosystem and Toolbox integration
- **Apple** - For Xcode integration support
- **Open Source Community** - For continuous feedback and improvement suggestions

---

**📋 Report Issues**: [GitHub Issues](https://github.com/OrvexaDev/OYI/issues)
**🏠 Homepage**: [GitHub Repository](https://github.com/OrvexaDev/OYI)
**📖 Documentation**: [README.md](https://github.com/OrvexaDev/OYI/blob/main/README.md)

**Made with ❤️ by [Orvexa by KAGEYOSHI](https://github.com/OrvexaDev)**
